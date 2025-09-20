from typing import List
from fastapi import APIRouter,Depends,HTTPException
from schemas import ExpenseCreate,ExpenseOut
from db.prisma.client import db
from datetime import datetime
from utils import get_current_user
import io
import matplotlib.pyplot as plt # type: ignore
from fastapi import APIRouter, Response, Depends
from datetime import datetime, timedelta

router = APIRouter()


@router.post('/expense/', response_model=ExpenseOut)
async def create_expense(
    expense: ExpenseCreate,
    current_user = Depends(get_current_user)
):
    new_expense = await db.expense.create(
        data={
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date or datetime.utcnow(),
            "user": {"connect": {"id": current_user.id}}  
        }
    )
    return new_expense

@router.put("/expenses/{expense_id}", response_model=ExpenseOut)
async def update_expense(expense_id: int, expense: ExpenseCreate, current_user = Depends(get_current_user)):
    db_expense = await db.expense.find_unique(where={"id": expense_id})
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if db_expense.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this expense")
    
    updated_expense = await db.expense.update(
        where={"id": expense_id},
        data={
            "title": expense.title,
            "amount": expense.amount,
            "category": expense.category,
            "date": expense.date or datetime.utcnow(),
        }
    )
    return updated_expense

@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: int, current_user = Depends(get_current_user)):
    db_expense = await db.expense.find_unique(where={"id": expense_id})
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if db_expense.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this expense")
    
    await db.expense.delete(where={"id": expense_id})
    return {"detail": "Expense deleted successfully"}


@router.get('/expense', response_model=List[ExpenseOut])
async def export_expense(current_user = Depends(get_current_user)):
    return await db.expense.find_many(where={"userId": current_user.id})

@router.get("/expenses/weekly-graph")
async def weekly_expenses_graph():
   

    today = datetime.today()
    week_ago = today - timedelta(days=7)

    # Fetch expenses in the last 7 days
    expenses = await db.expense.find_many(
        where={"date": {"gte": week_ago}},
        order={"date": "asc"}
    )

    

    # Prepare data
    dates = [e.date.strftime("%a") for e in expenses]
    amounts = [e.amount for e in expenses]

    # Create matplotlib plot
    fig, ax = plt.subplots()
    ax.plot(dates, amounts, marker="o", linestyle="-", color="blue")
    ax.set_title("Weekly Expenses")
    ax.set_xlabel("Day")
    ax.set_ylabel("Amount")

    # Save plot to memory
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")
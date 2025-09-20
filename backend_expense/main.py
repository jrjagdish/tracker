from fastapi import FastAPI
from routers import expense,auth  # import your router
from db.prisma.client import connect_db,disconnect_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_db()

# Disconnect when app stops
@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()


# Include the jobs router
app.include_router(expense.router)
app.include_router(auth.router)



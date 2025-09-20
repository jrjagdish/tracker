from prisma import Prisma

db = Prisma()

async def connect_db():
    await db.connect()

# Disconnect when the app shuts down
async def disconnect_db():
    await db.disconnect()
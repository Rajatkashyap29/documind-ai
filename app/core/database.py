from .settings import settings
from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy import create_engine

Base = declarative_base()
engine = create_engine(settings.DATABASE_URL)
Sessionlocal = sessionmaker(bind=engine)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
from pydantic_settings import SettingsConfigDict,BaseSettings

class Setting(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env",extra="ignore")
    
    DATABASE_URL:str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

settings = Setting()    
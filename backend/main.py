from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(root_path="/api")


class EmailInfo(BaseModel):
    name: str
    subject: str
    content: str
    contact_email: str


@app.get("/")
async def root():
    print("Hello")
    return {"message": "Hello World"}


@app.post("/send_email")
async def send_email(email_info: EmailInfo):
    print(f"Sending email {email_info}")
    return {
        "status": "FAIL",
        "reason": "Sending the message failed for an unknown reason, please try contacting me by email or phone.",
    }
    return {"status": "SUCCESS"}

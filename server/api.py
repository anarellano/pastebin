from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import PasteData
import uvicorn
from sqlite_commands import create_name, insert_text, find_name, fetch_all

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/store_paste")
def store_paste(paste_data: PasteData):
    if not paste_data.text:
        raise HTTPException(status_code=404, detail="text required")

    if paste_data.text:
        text_data = paste_data.text
        name = create_name()
        path = f"./filestorage/{name}"
        insert_text(name, path)

        # add name, text in file
        create_entry = open(path, "a")
        create_entry.write(text_data)
        create_entry.close

        return {"name": name}


@app.get("/find/{name}")
def find(name: str):
    # Get URL by id
    file_details = find_name(name)
    if not file_details:
        raise HTTPException(status_code=404, detail="No Name found")

    f = open(file_details[2], "r")
    show_file = f.read()
    return {"file": file_details, "show_file": show_file}


@app.get("/history_component")
def history_component():
    data = fetch_all()
    formatted_data = []
    for entry in data:
        formatted_data.append({"name": entry[0], "date": entry[1].isoformat() + "Z"})
    return formatted_data


if __name__ == "__main__":
    host = "localhost"
    port = 8000

    print("server started on http://{host}:{port}")
    uvicorn.run("api:app", host=host, port=port, reload=True)

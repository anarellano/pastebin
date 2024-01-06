from os import remove
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import PasteData
import uvicorn
from sqlite_commands import create_name, insert_text, find_name, fetch_all
from args import parse_args

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allows all origins
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
args = parse_args()


@app.post("/store_paste")
def store_paste(paste_data: PasteData):
    if not paste_data.text:
        raise HTTPException(status_code=404, detail="text required")

    if paste_data.text:
        text_data = paste_data.text
        name = create_name()
        path = f"./filestorage/{name}"
        insert_text(args.sqlite_file_path, name, path)

        # add name, text in file
        create_entry = open(path, "a")
        create_entry.write(text_data)
        create_entry.close

        return {"name": name}


@app.get("/find/{name}")
def find(name: str):
    # Get URL by id
    file_details = find_name(args.sqlite_file_path, name)
    if not file_details:
        raise HTTPException(status_code=404, detail="No Name found")

    f = open(file_details[2], "r")
    show_file = f.read()
    return {"file": file_details, "show_file": show_file}


@app.get("/history_component")
def history_component():
    data = fetch_all(args.sqlite_file_path)
    print(data)
    formatted_data = []
    for entry in data:
        formatted_data.append({"name": entry[0], "date": entry[1].isoformat() + "Z"})
    return formatted_data


@app.get("/delete/{name}")
def delete(name: str):
    file_details = find_name(args.sqlite_file_path, name)
    if not file_details:
        raise HTTPException(status_code=404, detail="No Name found")
    try:
        remove(file_details[2])
        print("deleted file")
    except:
        print("Could not delete")


if __name__ == "__main__":
    print("server started on http://{host}:{port}")
    uvicorn.run("api:app", host=args.host, port=args.port, reload=True)

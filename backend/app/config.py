from dotenv import load_dotenv
import os

load_dotenv()
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_WORKSPACE = "cavitycatcher"
ROBOFLOW_PROJECT = "adr"
ROBOFLOW_VERSION = 6

from roboflow import Roboflow
from app.config import ROBOFLOW_API_KEY, ROBOFLOW_WORKSPACE, ROBOFLOW_PROJECT, ROBOFLOW_VERSION

rf = Roboflow(api_key=ROBOFLOW_API_KEY)
project = rf.workspace(ROBOFLOW_WORKSPACE).project(ROBOFLOW_PROJECT)
model = project.version(ROBOFLOW_VERSION).model

def predict_with_roboflow(image_path):
    return model.predict(image_path).json()

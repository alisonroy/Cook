from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers

import tensorflow as tf
import PIL
import os
import numpy as np
import matplotlib.pyplot as plt
from keras_preprocessing import image

train_path = "train"
train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    train_path, seed=2509, image_size=(224, 224), batch_size=32)
class_names = train_dataset.class_names
model = tf.keras.models.load_model('fruits_vegetable_detection.h5')
image_path = "cucu.jpeg"
img = image.load_img(image_path, target_size=(224, 224, 3))

x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
images = np.vstack([x])
pred = model.predict(images, batch_size=32)
label = np.argmax(pred, axis=1)
# print("Actual: "+image_path.split("/")[-2])
print(label)
print("Predicted: " + class_names[np.argmax(pred)])

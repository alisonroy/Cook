from flask import Flask, jsonify, request, render_template
from datetime import datetime
from hashlib import sha256
import random2
import base64
from io import BytesIO
from PIL import Image
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from flaskext.mysql import MySQL

import tensorflow as tf
import PIL
import os
import numpy as np
import matplotlib.pyplot as plt
from keras_preprocessing import image


app = Flask(__name__, static_url_path='', static_folder='.')
try:
    mysql = MySQL()

    # MySQL configurations
    app.config['MYSQL_DATABASE_USER'] = "sgroot"
    app.config['MYSQL_DATABASE_PASSWORD'] = "BUB9-xUel9CE1xtD"
    app.config['MYSQL_DATABASE_DB'] = "cook"
    app.config['MYSQL_DATABASE_HOST'] = "SG-cookit-7556-mysql-master.servers.mongodirector.com"
    mysql.init_app(app)
except:
    print("Unable to connect to the database")


# CORS section


@app.after_request
def after_request_func(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

# end CORS section


# 404 handle


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Your requested url could not be found: ' + request.url,
    }
    res = jsonify(message)
    res.status_code = 404
    return res

# 403 handler


@app.errorhandler(403)
def forbidden(error=None):
    message = {
        'status': 403,
        'message': 'Forbidden',
    }
    res = jsonify(message)
    res.status_code = 403
    return res


if __name__ == "__main__":
    app.run(debug=True)


@app.route('/signup', methods=['POST'])
def signup():
    try:
        name = request.form.get("name")
        paswd = request.form.get("pass")
        h = sha256()
        h.update(b'{paswd}')
        password = h.hexdigest()
        email = request.form.get("email")
        mob_no = request.form.get("ph_no")
        auth = sha256()
        rand = random2.random()
        auth.update(b'{rand}')
        auth_token = h.hexdigest()
        if password and email and mob_no and auth_token and name and request.method == 'POST':
            # insert record in database
            conn = mysql.connect()
            updt_query = f"INSERT INTO `cook`.`login_details` (email,name,auth_token,password,ph_no,history) VALUES ('{email}','{name}','{auth_token}','{password}',{mob_no},' ');"
            updt = conn.cursor()
            if (updt.execute(updt_query)):
                conn.commit()
                updt.close()
                conn.close()
                res = jsonify(auth_token)
                return res
            else:
                conn.close()
                res = jsonify("failed")
                return res
        else:
            return forbidden()

    except Exception as e:
        print(e)


@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.form.get("email")
        paswd = request.form.get("pass")
        h = sha256()
        h.update(b'{paswd}')
        password = h.hexdigest()
        if email and password and request.method == 'POST':
            conn = mysql.connect()
            usr_chk = conn.cursor()
            usr_query = f"SELECT EXISTS(SELECT email FROM `cook`.`login_details` WHERE email = '{email}' );"
            usr_chk.execute(usr_query)
            chk = usr_chk.fetchall()
            usr_chk.close()
            if chk[0][0] == 1:
                pass_query = f"SELECT email, password FROM `cook`.`login_details` WHERE  email='{email}'"
                pass_csr = conn.cursor()
                pass_csr.execute(pass_query)
                pass_chk = pass_csr.fetchall()
                pass_csr.close()
                if password == pass_chk[0][1]:
                    user = pass_chk[0][0]
                    auth = sha256()
                    rand = random2.random()
                    auth.update(b'{rand}')
                    auth_token = h.hexdigest()
                    updt_query = f"UPDATE `cook`.`login_details` SET `auth_token` = '{auth_token}' WHERE (`email` = '{email}');"
                    updt = conn.cursor()
                    updt.execute(updt_query)
                    conn.commit()
                    updt.close()
                    conn.close()
                    res = jsonify(auth_token)
                    return res
                else:
                    conn.close()
                    res = jsonify("failed")
                    return res
            else:
                conn.close()
                res = jsonify("false")
                return res
        else:
            return forbidden()

    except Exception as e:
        print(e)

@app.route('/gethistory', methods=['POST'])
def gethistory():
    try:
        email = request.form.get("email")
        conn = mysql.connect()
        det_query = f"SELECT `email`,`name`,`ph_no`,`history` FROM `cook`.`login_details` WHERE  email='{email}'"
        det_csr = conn.cursor()
        det_csr.execute(det_query)
        det_chk = det_csr.fetchall()
        det_csr.close()
        conn.close()
        return jsonify(det_chk)
    except Exception as e:
        print(e)

@app.route('/getrecipe', methods=['POST'])
def getrecipe():
    try:
        file = request.form.get('img')
        email = request.form.get("email")
        starter = file.find(',')
        image_data = file[starter+1:]
        image_data = bytes(image_data, encoding="ascii")
        im = Image.open(BytesIO(base64.b64decode(image_data)))
        im.save('image.png')
        train_path = "train"
        train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
            train_path, seed=2509, image_size=(224, 224), batch_size=32)
        class_names = train_dataset.class_names
        model = tf.keras.models.load_model('fruits_vegetable_detection.h5')
        image_path = "image.png"
        img = image.load_img(image_path, target_size=(224, 224, 3))

        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        images = np.vstack([x])
        pred = model.predict(images, batch_size=32)
        label = np.argmax(pred, axis=1)
        predicted = class_names[np.argmax(pred)]
        print("Predicted: " + predicted)
        conn = mysql.connect()
        usr_chk = conn.cursor()
        usr_query = f"SELECT `dish_name`,`time_required`,`cuisine`,`ingredients`,`description` FROM `cook`.`recipe` where `ingredients` LIKE'%{predicted}%';"
        usr_chk.execute(usr_query)
        chk = usr_chk.fetchall()
        usr_chk.close()
        get_query = f"SELECT `history` FROM `cook`.`login_details` WHERE `email`='{email}';"
        getchk = conn.cursor()
        getchk.execute(get_query)
        get = getchk.fetchall()
        temp=get[0][0]
        for i in chk:
            if i[0] not in temp:
                temp=temp+','+i[0]
        getchk.close()
        updt_query = f"UPDATE `cook`.`login_details` SET `history` = '{temp}' WHERE (`email` = '{email}');"
        updt = conn.cursor()
        updt.execute(updt_query)
        conn.commit()
        updt.close()
        conn.close()
        return jsonify(chk)

    except Exception as e:
        print(e)

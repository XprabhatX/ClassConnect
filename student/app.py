from flask import Flask, request,jsonify
import pymysql
from flask_cors import CORS

mysql = Flask(__name__)
CORS(mysql)

# Connecting to MySQL database
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='',
    db='pwa'
)

@mysql.route('/register_subscription', methods=['POST'])
def register_subscription():
    subscription_info = request.json.get('subscription')

    try:
        # Connect to MySQL
        connection = conn
        cursor = connection.cursor()

        # Prepare SQL query
        sql = """
        INSERT INTO student_data (endpoint, keys_auth, keys_p256dh)
        VALUES (%s, %s, %s)
        """
        values = (
            subscription_info['endpoint'],            #This is the URL that represents the location where the server will send the push notification.
            subscription_info['keys']['auth'],        #This is an authentication secret that helps ensure that the message sent to the client is from the server they subscribed to. The server includes it in payload to authenticate
            subscription_info['keys']['p256dh']       #This is a Deffie-Hellman public key used for encrypting the payload of the push notification.
        )

        # Execute query
        cursor.execute(sql, values)
        connection.commit()

        # Close connection
        cursor.close()
        connection.close()

        return jsonify({'status': 'Subscription stored successfully!'}), 200
    except Error as e:
        print('Error:', e)
        return jsonify({'status': 'Failed to store subscription'}), 500

if __name__ == '__main__':
    mysql.run(debug=True)

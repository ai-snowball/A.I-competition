from flask import Flask, render_template, redirect, request, url_for
 
app = Flask(__name__)
 
@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        return redirect(url_for('test'))
    return render_template('index.html')
 

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=83, debug=True) #debug is True, change host and port as needed.
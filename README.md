# RetroPanel
RetroPanel is a panel made monitor and control Minecraft bot(s)

![alt text](https://github.com/Vsimpro/retropanel/blob/main/images/UI.png)

## Usage

### With node.js

You should run the application on an inward facing webserver, for example a respberry pi on your local network.


1. Install the dependencies:

    ```sh
    $ npm install path
    $ npm install cors
    $ npm install express
    $ npm install mineflayer
    ```

2. On `main.js` change _credentials_ and _server_ values to your liking:

    ```js
    const credentials = {
      username    : "account@email.address"
      password    : "your_pass"
      auth        : "microsoft" / "mojang" 
      // Microsoft with MFA doesn't work.
    }
    const server = {
    host    : "hostname",
    port    : "25565",
    }
    ```
    
3. Run the application:

    ```sh
    $ node main.js
    ```
 And the application should now run in `http://localhost:5501/`
 
## Todo's
- Add functionalities
- Multiple bot support
- Credentials from file

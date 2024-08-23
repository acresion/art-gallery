# art-gallery
A repository containing code for my social media art gallery website based on NodeJS and Express

# Current task:
We have created a scenario where we can attempt establishing a docker connection to a pod. While this is successful, the pods terminate due to exit code 137, which signifies memory overload. It also refuses the connection. First step is to try and figure out how to handle this error in JS.

Remember that 127.0.0.1 indicates localhost. Of the current computer.

# Updates:
Talk with dad helped. What happened is that in fact, whenever I attempt to connect to MongoDB, I actually attempt to connect to the MongoDB on THAT OPERATING SYSTEM. It works locally, since I have the application pre installed, but it doesnt work on the container, as, in fact, it doesn't exist on the container. It would then mercy kill a pod due to memory overflow (prevent infinites). What I need it to do is actually connect it to the DEVICE's  localhost, in such a way that on a container, I connect to this computer's mongodb port.

Update 1: Altering the IP address may or may not work, as the DNS inside the computer may or may not recognize the IP being outside the computer. The more optimal strategy is to find a free MongoDB cloud service and change the URI to reflect that.

# Notes:
You may notice that I just spammed try catch in every async function. You may be asking: Why do that instead of one massive try catch? I appreciate critical thinking, unfortunately, try catch will only catch while an async function is running, not before or after it ran. This style of error handling/try-catch spam is not sustainable with larger projects, and it would be advised to persue an alternate method.

# Setup Instructions:
Several things need to be set up before you can run this application on your own local device.
First, you need to set everything up with MongoDB Atlas. There exists a free plan, don't worry. After that, you would need to create a new cluster that I named "gallery". This will be the main cluster you will be working with. After that, you will need to create a database also named "gallery" as well as two collections named "artworks" and "accounts".

Next, you would need to create a secret.yaml and fill it with your credentials. After the credentials are properly encoded in base 64, you must then initalize the database by running the command node database-initializer.js. 

To properly restart the pods, remember to run ./restartDeployment.sh. This will ensure the old deployment and service gets removed and a new deployment and service gets established in its place. 

To actually run the application proper, first run the command kubectl exec -it (pod name here) -- /bin/sh for all three pods

Then run kubectl port-forward service/art-gallery-service 3000:3000.
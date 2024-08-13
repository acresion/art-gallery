# art-gallery
A repository containing code for my social media art gallery website based on NodeJS and Express

# Current task:
We have created a scenario where we can attempt establishing a docker connection to a pod. While this is successful, the pods terminate due to exit code 137, which signifies memory overload. It also refuses the connection. First step is to try and figure out how to handle this error in JS.

Remember that 127.0.0.1 indicates localhost. Of the current computer.

# Updates:
Talk with dad helped. What happened is that in fact, whenever I attempt to connect to MongoDB, I actually attempt to connect to the MongoDB on THAT OPERATING SYSTEM. It works locally, since I have the application pre installed, but it doesnt work on the container, as, in fact, it doesn't exist on the container. It would then mercy kill a pod due to memory overflow (prevent infinites). What I need it to do is actually connect it to the DEVICE's  localhost, in such a way that on a container, I connect to this computer's mongodb port.
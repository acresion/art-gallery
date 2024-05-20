# performs the clean function first
docker rm art-gallery-container
docker rmi art-gallery
# builds a new image
docker build -t art-gallery:latest .
#runs a new container
docker run -p 3000:3000 --name art-gallery-container art-gallery:latest
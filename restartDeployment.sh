#kubectl delete  the old deployment
kubectl delete deployment art-gallery
kubectl delete  services art-gallery-service
#kubectl build  the old deployment
kubectl apply -f deployment.yml
kubectl apply -f services.yml
#check new pods
kubectl get pods
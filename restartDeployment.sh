#kubectl delete  the old deployment
kubectl delete -f deployment.yml
kubectl delete -f services.yml
#kubectl build  the old deployment
kubectl apply -f deployment.yml
kubectl apply -f services.yml
#check new pods
kubectl get pods
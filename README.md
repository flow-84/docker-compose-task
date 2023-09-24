# docker-task2

Willkommen zur Übung mit Netzwerken!

Um diese Aufgabe zu lösen, müssen folgende Dinge erledigt werden:

- Dockerfile schreiben, um die App zu containerisieren
- eigenes Netzwerk für Container erstellen
- MariaDB Container starten (ersetze `<MY_CUSTOM_NETWORK>` mit dem Container Netzwerk aus dem vorherigen Schritt)
  `docker run -d --env MARIADB_USER=example-user --env MARIADB_PASSWORD=my_cool_secret --env MARIADB_ROOT_PASSWORD=my-secret-pw --env MARIADB_DATABASE=restaurants --net <MY_CUSTOM_NETWORK> --name database mariadb:latest`
- App starten und in das gleiche Netzwerk hängen, wie die Datenbank

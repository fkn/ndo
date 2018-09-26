## Commit procedure

1.  Fork original project
2.  Clone your fork
3.  Add new terrific features
4.  Commit it
5.  Create pull request

### Fork original project

To fork it visit page https://github.com/fkn/ndo and click button "Fork" in the top-right corner.

### Clone your fork

Open page https://github.com/YOUR_NAME/ndo (replace YOUR_NAME with your nick name on GitHub).

Find button "Cone or Download" and click on it.

Copy value into clipboard from the field that appears.

Open bash/cmd or any other terminal app and type (http...-value is in your clipboard):

```bash
git clone https://github.com/YOUR_NAME/ndo.git
```

Configure upstream:

```bash
cd ndo
git remote add upstream https://github.com/fkn/ndo.git
```

### Add new terrific features

Coding magic.

### Commit it

To check your changes type:

```bash
git status
```

Ensure that there is no extraneous changes in files.

Check that your changes are correspond to our coding rules:

```bash
yarn lint
```

Check that you haven't added any regression:

```bash
yarn test
```

Type `git status` again and add all needed files:

```bash
git add FILE_NAME
```

(keep in mind that usually we don't commit file `database.sqlite`)

To commit your changes into local repo type (replace `COMMIT MESSAGE` with short description of what you've changed).

If you are working on known issue, don't forget to add "`(close #N)`" in the end of your message (N - number of issue).

```bash
git commit -m "COMMIT MESSAGE"
```

Send your local changes to GitHub

```bash
git push origin master
```

### Create pull request

Open page https://github.com/fkn/ndo/pulls and click "New pull request". Follow instructions and create new pull request.

## Sync with upstream

Usually it's enough to run this commands:

```bash
git fetch upstream
git checkout master
git merge upstream/master
```

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="main">
  		<g:set var="entityName" value="${message(code: 'project.label', default: 'Project')}" />
  		<title><g:message code="default.list.label" args="[entityName]" /></title>
</head>
<body>
<div ng-controller="ProjectCtrl">
    <div id="project_fragment">
        <nav id="navSideBar">
            <p ng-click="aa()">aa</p>
            <h3>Projects <img src="../images/skin/add.png" alt="add" ng-click="open()" style="cursor:pointer; float:right; margin-top: 11px;"/></h3>
            <input type="text" ng-model="search" class="search-query" placeholder="Search Projects">
            <ul class="nav">
                <li ng-repeat="project in projects | filter:search | orderBy:'name'" ng-click="viewSources(project)" style="cursor:pointer;">
                    {{project.name}}
                    <img src="../images/skin/delete.png" alt="add" ng-click="open()" style="margin-left: 5px; cursor:pointer; float:right;"/>
                    <img src="../images/skin/pencil.png" alt="add" ng-click="open()" style=" cursor:pointer; float:right;"/>
                </li>
            </ul>
        </nav>
    </div>

    <div id="source_fragment" style=" width: 79%; float: left;">
        <section id="logPageSection" style=" width: 79%; float: left;">
            <header class="sectionHeader"><h2>Sources {{ project.name }} <img src="../images/skin/add.png" alt="add" ng-click="open()" style="cursor:pointer; float:right; margin-top: 11px;"/></h2></header>

            %{--<div>--}%
                %{--<button class="btn" ng-click="viewSourceConfiguration(project)">Create</button>--}%
                %{--<button class="btn"><g:link controller="source" action="index" class="selected" id="">Create</g:link></button>--}%
            %{--</div>--}%

            <article class="sectionArticleContent" id="sourcesList">

            <li class="default">
                <table id="thetable" class="simpleResultsTable inner">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>HOST</th>
                            <th>SOURCE</th>
                            <th>DATA TYPE</th>
                            <th>COUNT EVENT</th>
                            <th>EARLIEST EVENT</th>
                            <th>LAST EVENT</th>
                            <th>PATTERN</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="cursor: pointer;" ng-repeat="source in project.sources">
                            <td>{{source.name}}</td>
                        </tr>
                    </tbody>
                </table>
            </li>
            </article>
        </section>
    </div>


    <div modal="shouldBeOpen" close="close()" options="opts" style="color: #000000">
        <div class="modal-header">
            <h3>Create new project</h3>
        </div>
        <form method="POST" action="" novalidate class="form-horizontal">
            <div class="modal-body">
                <div class="control-group">
                    <label class="control-label" for="inputName">Name</label>
                    <div class="controls">
                        <input type="text" id="inputName" placeholder="Name" ng-model="newProject.name">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-warning submit" ng-click="createProject(newProject)">Create</button>
                <button class="btn btn-warning cancel" ng-click="close()">Cancel</button>
            </div>
        </form>
    </div>
</div>
</body>
</html>
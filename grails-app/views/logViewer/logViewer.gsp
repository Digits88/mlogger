<%--
  Created by IntelliJ IDEA.
  User: Martin
  Date: 21/07/13
  Time: 13:25
  To change this template use File | Settings | File Templates.
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <meta name="layout" content="main">

  <title>Log Viewer</title>
</head>
<body>
<div ng-controller="LogViewerCtrl">
    <nav id="navSideBar">
        <h3>Projects</h3>
        <ul class="nav">
            <accordion close-others="oneAtATime">
                <accordion-group heading="{{project.name}}" ng-repeat="project in projects">
                    <li ng-repeat="source in project.sources" ng-click="viewSource(project, source)" style=" cursor:pointer;">{{source.name}}</li>
                </accordion-group>
            </accordion>
        </ul>
    </nav>
    <section id="logPageSection" style=" width: 79%; float: left;">
        <header class="sectionHeader"><h3>Log Viewer for source {{source.name}} </h3></header>
        <article class="sectionArticleFilter" style="text-align: justify;">
                <div class="inner">
                    <div class="titlebar">Filter</div>
                    <div class="contents">
                        %{--<g:form controller="home" action="filter">--}%
                        <g:formRemote name="myForm" on404="alert('not found!')" update="log" id="filterForm"
                                      url="[controller: 'logViewer', action:'eventFilter']">
                            %{--<g:hiddenField name="id" value="${sourceInstance.id}" />--}%
                            %{--<g:hiddenField name="max" value="${params.max}" />--}%
                            %{--<g:hiddenField name="offset" value="${params.offset}" />--}%
                            <div class="test">
                                <div style="float: left;">
                                    <label for="fromDate">From Date</label>
                                    <input id="fromDate" type="text" >
                                </div>
                                <div style="float: left;">
                                    <label for="toDate">To Date</label>
                                    <input id="toDate" type="text" >
                                </div>
                                <div class=" " style="float: left;">
                                    <label for="searchText"><g:message code="project.description.label" default="Text" /></label>
                                    <g:textField name="searchText" />
                                </div>
                            </div>
                            <div style="clear: left;"></div>
                            <br />
                            <div class="field-box on_off" style="float: right">
                                <input type="checkbox" id="on_off" />
                                %{--<p>Checkbox status is <strong><span id="status">...</span></strong>.</p>--}%
                            </div>

                            <div style="clear: right;"></div>
                                    %{--</fieldset>--}%
                                    %{--<fieldset class="buttons">--}%
                                        %{--<g:submitToRemote controller="logT" action="filter" update="log" name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" />--}%
                                        %{--<a href="#" onclick="hideElement()">Hide</a>--}%
                                        %{--<a href="#" onclick="showElement()">Show</a>--}%
                            %{--</fieldset>--}%
                        </g:formRemote>
                    </div>
                </div>
        </article>
        <article>
            %{--<g:form action="search">--}%
                %{--<g:hiddenField name="id" value="${sourceInstance.id}" />--}%
                %{--<g:hiddenField name="max" value="${params.max}" />--}%
                %{--<g:hiddenField name="offset" value="${params.offset}" />--}%
                %{--<div class=" " style="float: left;">--}%
                    %{--<label for="searchText2"><g:message code="project.description.label" default="Search: " /></label>--}%
                    %{--<g:textField name="searchText2" />--}%
                %{--</div>--}%
                %{--<g:submitToRemote update="log" value="Search" action="search"/>--}%
            %{--</g:form>--}%
        </article>
                                            %{--<a href="javascript:void(0)" onclick="hideElement()" style="color: red">Hide</a>--}%
                                            %{--<a href="javascript:void(0)" onclick="showElement()" style="color: red">Show</a>--}%
            <article class="sectionArticleContent" id="log">

            <ul class="buffer EventsViewerSoftWrap" style="padding-left: 0;">
                <li class="default">
                    <table class="simpleResultsTable inner">
                        <thead>
                            <tr>
                                <th ng-repeat="head in gridData.headers">{{head}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="row in gridData.rows">
                                <td ng-repeat="cell in row.cells">{{cell.value}}</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
            </ul>
            <pagination rotate="false" num-pages="gridData.pagination.noOfPages" current-page="currentPage" max-size="maxSize" boundary-links="true" style="cursor:pointer"></pagination>

        </article>
    </section>
</div>
</body>
</html>
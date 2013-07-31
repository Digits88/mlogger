<div id="project_fragment">
    <nav id="navSideBar">
        <h3>Projects</h3>
        %{--<g:remoteLink action="ajx_create" title="Add" update="projectDialog" onSuccess="openDialog('projectDialog','Create New Project')" class="button-mlogger" >Add</g:remoteLink>&nbsp;--}%
        %{--<a class="button-mlogger" title="Delete" onclick="openDialog('projectDialog','Create New Project')">Delete</a> &nbsp;--}%
        %{--<a class="button-mlogger" title="Edit" onclick="openDialog('projectDialog','Edit Project')">Edit</a>--}%
        %{--<ul class="nav">--}%
            %{--<g:each in="${projectInstanceList}" status="i" var="projectInstance">--}%
                %{--<li><g:remoteLink controller="source" action="index" id="${projectInstance.id}" update="[success:'source_fragment',failure:'error']" on404="alert('not found');">${projectInstance.name}</g:remoteLink></li>--}%
            %{--</g:each>--}%
        %{--</ul>--}%
        <div class="pagination">
           %{--<util:remotePaginate controller="project" action="ajx_list" total="${projectInstanceTotal}" update="project_fragment" />--}%
        </div>
    </nav>
</div>
<%@ page import="mlogger.Source" %>



<div class="fieldcontain ${hasErrors(bean: sourceInstance, field: 'name', 'error')} ">
	<label for="name">
		<g:message code="source.name.label" default="Name" />
		
	</label>
	<g:textField name="name" value="${sourceInstance?.name}" />
</div>


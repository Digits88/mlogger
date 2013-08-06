%{--<!DOCTYPE html>--}%
%{--<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->--}%
%{--<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->--}%
%{--<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->--}%
%{--<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->--}%
%{--<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->--}%
	%{--<head>--}%
		%{--<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">--}%
		%{--<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">--}%
		%{--<title><g:layoutTitle default="Grails"/></title>--}%
		%{--<meta name="viewport" content="width=device-width, initial-scale=1.0">--}%
		%{--<link rel="shortcut icon" href="${resource(dir: 'src/assets', file: 'favicon.ico')}" type="image/x-icon">--}%
		%{--<link rel="apple-touch-icon" href="${resource(dir: 'src/assets', file: 'apple-touch-icon.png')}">--}%
		%{--<link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'src/assets', file: 'apple-touch-icon-retina.png')}">--}%
		%{--<link rel="stylesheet" href="${resource(dir: 'src/assets', file: 'main.css')}" type="text/css">--}%
		%{--<link rel="stylesheet" href="${resource(dir: 'src/assets', file: 'mobile.css')}" type="text/css">--}%
		%{--<g:layoutHead/>--}%
		%{--<r:layoutResources />--}%
	%{--</head>--}%
	%{--<body>--}%
		%{--<div id="grailsLogo" role="banner"><a href="http://grails.org"><img src="${resource(dir: 'src/assets', file: 'grails_logo.png')}" alt="Grails"/></a></div>--}%
		%{--<g:layoutBody/>--}%
		%{--<div class="footer" role="contentinfo"></div>--}%
		%{--<div id="spinner" class="spinner" style="display:none;"><g:message code="spinner.alt" default="Loading&hellip;"/></div>--}%
		%{--<g:javascript library="application"/>--}%
		%{--<r:layoutResources />--}%
	%{--</body>--}%
%{--</html>--}%



<!--
  @author Martin Micunda
  @version <g:meta name="app.version"/>
-->

<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  		%{--<title><g:layoutTitle default="mLogger"/></title>--}%
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
  		<link rel="apple-touch-icon" href="${resource(dir: 'images', file: 'apple-touch-icon.png')}">
  		<link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'images', file: 'apple-touch-icon-retina.png')}">
  		<link rel="stylesheet" href="${resource(dir: 'css', file: 'mobile.css')}" type="text/css">
        <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">
  		<g:layoutHead/>
        <r:require modules="application"/>
  		<r:layoutResources />
    </head>
    <body ng-app="mloggerApp">
        <g:if env="development">
            <!-- livereload snippet -->
            <script src="http://localhost:35729/livereload.js"></script>
        </g:if>
        <!-- the header and navigation -->
        <header role="banner" id="header">
            <h1 id="logo">mLogger</h1>
            <nav role="navigation" id="mainNavBar">
                <ul id="mainNav">
                    <li><a href="/mlogger/">Home</a></li>
                    <li><a href="#/viewer">Log Viewer</a></li>
                    <li><a href="#/">Projects</a></li>
                        <ul>
                            <li><a href="#">Item 01</a></li>
                            <li><a href="#" class="selected">Item 02</a></li>
                            <li><a href="#">Item 03</a></li>
                        </ul>
                        <div class="clear"></div>
                    </li>
                    <li><a href="#">Administration</a>
                    <ul>
                        <li><g:link controller="project" action="index">Projects & SourceSSs</g:link></li>
                        <li><a href="#">Sources</a></li>
                    </ul>
                        <div class="clear"></div>
                    </li>
                    <li><a href="#">Parent 04</a></li>
                </ul>

                <div class="clear"></div>
            </nav>
        </header>

  		<g:layoutBody/>
        <footer id="pageFooter">&copy; Martin Micunda</footer>
  		<div id="spinner" class="spinner" style="display:none;"><g:message code="spinner.alt" default="Loading&hellip;"/></div>
  		<r:layoutResources />
    </body>
</html>
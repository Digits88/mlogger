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
        %{--<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css" rel="stylesheet">--}%
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
        <header class="navbar-wrapper row">
            <div class="col-lg-2"></div>
            <div class="col-lg-8 container">
                <nav role="navigation" class="navbar navbar-inverse navbar-static-top" ng-controller="NavCtrl">
                    <div class="navbar-inner">
                        <!-- .navbar-toggle is used as the toggle for collapsed navbar content -->
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-inverse-collapse">
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                          <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">mLogger</a>
                        <div class="nav-collapse collapse">
                            <ul class="nav navbar-nav">
                                <li data-ng-class="{active: ($location.path() == '/') }"><a href="/mlogger/">Home</a></li>
                                <li data-ng-class="{active: ($location.path() == '/viewer') }"><a href="#/viewer">Log Viewer</a></li>
                                <li data-ng-class="{active: ($location.path() == '/projects') }"><a href="#/projects">Projects</a></li>
                                <li data-ng-class="{active: ($location.path() == '/administration') }"><a href="#/administration">Administration</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div class="col-lg-2"></div>
        </header>

        <div class="row">
  		    <g:layoutBody/>
        </div>
        %{--<footer class="col-lg-12">--}%
            %{--<div class="col-lg-2"></div>--}%
            %{--<div class="col-lg-8 container">--}%
                %{--<p class="pull-right">--}%
                    %{--<a href="http://martinm.net/" target="_blank">&copy; 2013 Martin Micunda</a> |--}%
                    %{--<a href="#/viewer">Log Viewer</a> |--}%
                    %{--<a href="#/">Projects</a> |--}%
                    %{--<a href="#">Administration</a>--}%
                %{--</p>--}%
            %{--</div>--}%
            %{--<div class="col-lg-2"></div>--}%
        %{--</footer>--}%
    %{--<div id="loadingWidget" class="row-fluid ui-corner-all" style="padding: 0 .7em; display: none;" loading-widget >--}%
          %{--<div class="loadingContent">--}%
              %{--<div id="spinner" class="spinner"><p style="margin-top: -18px;">Processing data ...</p></div>--}%
          %{--</div>--}%
      %{--</div>--}%
  		<r:layoutResources />
    </body>
</html>
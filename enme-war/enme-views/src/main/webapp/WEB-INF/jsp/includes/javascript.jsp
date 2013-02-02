<%@ include file="/WEB-INF/jsp/includes/taglibs.jsp"%>
<!--[if lt IE 9]>
     <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
<script>
         var dojoConfig= {
            baseUrl: '<%=request.getContextPath()%>/resources/js/',
            packages: [
                       { name: "dojo", location: "dojo" },
                       { name: "dijit", location: "dijit" },
                       { name: "dojox", location: "dojox" },
                       { name: "me", location: "me" }
            ],
            has: {
                    'dojo-firebug': false,
                    'dojo-debug-messages': false
                },
            // useCommentedJson : false,
            parseOnLoad : false,
            isDebug : 0,
            tlmSiblingOfDojo : false,
            async : true
            };
</script>
<script  src="<%=request.getContextPath()%>/resources/js/dojo/dojo.js"></script>
<script src="<%=request.getContextPath()%>/resources/js/me/run.js"></script>
<!-- Temporal service to store all service. -->
<script src="<%=request.getContextPath()%>/resources/js/commons.js"></script>
<script>
var config = {
    contextPath: '${pageContext.request.contextPath}'
};
require([
    "dojo",
    "dojo/_base/declare",
    "dojo/parser",
    "dojo/ready",
    'me/activity/Activity',
    "me/core/enme",
], function(dojo, declare, parser, ready, Activity, _ENME) {
    ready(function(){
        // Call the parser manually so it runs after our widget is defined, and page has finished loading
        _ENME.init({
            contextPath: '<%=request.getContextPath()%>',
            domain : '<%=WidgetUtil.getDomain(request)%>',
            suggest_limit : 10,
            delay : 1800000,
            debug : <%=EnMePlaceHolderConfigurer.getProperty("application.debug.mode")%>,
            message_delay : 5000,
            activity : {
                url : "<%=WidgetUtil.getDomain(request)%>/activity",
                logLevel : "<%=EnMePlaceHolderConfigurer.getProperty("not.main.activity.levelDebug")%>",
                maxConnections : <%=EnMePlaceHolderConfigurer.getProperty("not.main.activity.maxConnections")%>,
                maxNetworkDelay : <%=EnMePlaceHolderConfigurer.getProperty("not.main.activity.maxNetworkDelay")%>,
                delay : <%=EnMePlaceHolderConfigurer.getProperty("not.main.delay")%>,
                limit : <%=EnMePlaceHolderConfigurer.getProperty("not.main.limit")%>
            },
            tp_a : <%=EnMePlaceHolderConfigurer.getProperty("tp.min.answer.allowed")%>,
            tp_hr : <%=EnMePlaceHolderConfigurer.getProperty("tp.min.answer.hr")%>,
            tp_minsoa : <%=EnMePlaceHolderConfigurer.getProperty("tp.min.answer.minsoa")%>
        });
        //parse all widgets.
        parser.parse();
        <c:if test="${!detectedDevice}">
            // initialize the activity support
            var _E = _ENME.config('activity');
            //FUTURE: Modernizr.websockets
            var  activity = new Activity(_E, false);
            activity.connect();
            _ENME.setActivity(activity);
        </c:if>
        // reference, it' not possible add to the build.
        //dojo.require("dojox.fx");
        //dojo.require( "dojo.date.locale" );
        //dojo.require('dojox.timing');
    });
});
</script>
<!--
<script src="<%=request.getContextPath()%>/resources/js/default.js"></script>
 -->
<script type="text/javascript">
/**
 * default log.
 */
window.log = function () {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        arguments.callee = arguments.callee.caller;
        var a = [].slice.call(arguments);
        (typeof console.log === "object" ? log.apply.call(console.log, console, a) : console.log.apply(console, a));
    }
};
(function (b) {function c() {}
    for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop();) {
        b[a] = b[a] || c;
    }
})((function () {
    try {
        return window.console;
    } catch (err) {
        return window.console = {};
    }
})());
</script>
<%-- <script src="<%=request.getContextPath()%>/resources/js/encuestame/encuestame.js"></script> --%>
<%--<%=WidgetUtil.getAnalytics("analytics.inc")%>--%>
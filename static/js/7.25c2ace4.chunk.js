(this.webpackJsonprpgsp=this.webpackJsonprpgsp||[]).push([[7],{381:function(e,t,a){},382:function(e,t,a){},383:function(e,t,a){},407:function(e,t,a){"use strict";a.r(t);var c=a(19),r=a(0),n=a(404),s=a(360),l=a(397),o=a(287),i=a(288),u=a(22),j=a(27),p=a(32),b=a(47),d=a(81),h=a(213),O=a(415),f=a(1),x=["title","titleStyle","children"],y=n.a.Title,m=function(e){var t=e.title,a=e.titleStyle,c=void 0===a?{}:a,r=e.children,n=Object(h.a)(e,x);return Object(f.jsxs)(O.a,Object(d.a)(Object(d.a)({},n),{},{children:[Object(f.jsx)(y,{level:5,style:Object(d.a)({whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},c),children:t}),r]}))},v=a(435),g=a(436),_=a(410),w=a(414),S=(a(381),["gsProp"]),k=_.a.Panel,C=w.b.Item,P=function(e){var t=e.gsProp,a=Object(h.a)(e,S),n=Object(r.useState)(!1),s=Object(c.a)(n,2),l=s[0],o=s[1],i=Object(r.useState)(!1),u=Object(c.a)(i,2),j=u[0],p=u[1];Object(r.useEffect)((function(){b()}),[t.value]);var b=function(){p(!0),setTimeout((function(){p(!1)}),40)},O=function(e,t){return null===e||void 0===e?"--empty--":t.endsWith("arr")?"[ "+e+" ]":"boolean"===t?e?"true":"false":e};return Object(f.jsxs)(m,Object(d.a)(Object(d.a)({className:"game-state-prop-inspector-view ".concat(j?"updated":""),title:t.name,titleStyle:{fontSize:13},style:{marginBottom:12,borderColor:t.color}},a),{},{children:[Object(f.jsx)("div",{style:{position:"absolute",top:4,right:4,cursor:"pointer"},onClick:function(){o(!l)},children:l?Object(f.jsx)(v.a,{style:{fontSize:"14px",color:"#FFF"}}):Object(f.jsx)(g.a,{style:{fontSize:"14px",color:"#FFF"}})}),Object(f.jsx)("p",{style:{fontWeight:700,marginBottom:6},children:O(t.value,t.type)}),Object(f.jsx)(_.a,{defaultActiveKey:["-"],activeKey:[l?"1":"-"],ghost:!0,children:Object(f.jsx)(k,{header:null,showArrow:!1,children:Object(f.jsxs)(w.b,{column:1,size:"small",children:[Object(f.jsx)(C,{label:"Prev",children:O(t.prev_value,t.type)}),Object(f.jsx)(C,{label:"Type",children:t.type})]})},"1")})]}))},A=function(){var e=Object(p.useLiveQuery)(b.a.fetchPlayGameStateProps(null,!0));return Object(f.jsx)(m,{style:{flex:1},title:"Properties",bodyStyle:{display:"flex",flexDirection:"column",height:"100%"},children:Object(f.jsx)("div",{style:{overflow:"auto",flex:1},children:Object(f.jsx)("div",{style:{height:0,paddingTop:10},children:void 0!==e&&e.map((function(e){return Object(f.jsx)(P,{gsProp:e},e.game_state_prop_id)}))})})})},T=function(){return Object(f.jsxs)(O.a,{style:{flex:1},children:[Object(f.jsx)("p",{children:"Sequence actions runner (Full H)"}),Object(f.jsx)("p",{children:"Card content"}),Object(f.jsx)("p",{children:"Card content"})]})},N=a(184),E=a(57),F=a.n(E),L=a(58),B=a(42),D=a(43),z=a(33),I=function(){function e(){Object(B.a)(this,e)}return Object(D.a)(e,null,[{key:"simulateNextAct",value:function(){var e=Object(L.a)(F.a.mark((function e(t){return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",z.a.transaction("rw",z.a.play_game_state_props,z.a.chapters,z.a.acts,Object(L.a)(F.a.mark((function e(){var t,a,c,r;return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.a.play_game_state_props.where("name").anyOf("currentChapter").first();case 2:return t=e.sent,e.next=5,z.a.play_game_state_props.where("name").anyOf("currentAct").first();case 5:return a=e.sent,e.next=8,z.a.chapters.where("order").equals(t.value).first();case 8:return c=e.sent,e.next=11,z.a.acts.where("chapter_id").equals(c.id).count();case 11:if(r=e.sent,!(a.value+1>r)){e.next=19;break}return e.next=15,z.a.play_game_state_props.update(t.game_state_prop_id,{value:t.value+1});case 15:return e.next=17,z.a.play_game_state_props.update(a.game_state_prop_id,{value:1});case 17:e.next=21;break;case 19:return e.next=21,z.a.play_game_state_props.update(a.game_state_prop_id,{value:a.value+1});case 21:case"end":return e.stop()}}),e)})))).then((function(e){})).catch((function(e){return console.log("||--FAIL",e),Promise.reject(e)})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),q=n.a.Title,G=function(){return Object(f.jsxs)(O.a,{style:{flex:1,marginBottom:12},children:[Object(f.jsx)(q,{level:5,children:"Map"}),Object(f.jsx)("p",{children:"Map (flexible)"}),Object(f.jsx)("p",{children:"Card content"}),Object(f.jsx)("p",{children:"Card content"}),Object(f.jsx)(N.a,{onClick:function(){I.simulateNextAct()},children:"Simulate Next Act"})]})},M=a(408),W=function(){function e(){Object(B.a)(this,e)}return Object(D.a)(e,null,[{key:"arrayToObject",value:function(e,t){return e&&e.reduce((function(e,a,c){return e[a[t]]=a,e}),{})}}]),e}(),J=n.a.Title,K=n.a.Text,Q=function(){var e=Object(r.useState)(0),t=Object(c.a)(e,2),a=t[0],n=t[1],s=Object(r.useState)(0),l=Object(c.a)(s,2),u=l[0],j=l[1],d=Object(r.useState)(0),h=Object(c.a)(d,2),x=h[0],y=h[1],m=Object(r.useState)(0),v=Object(c.a)(m,2),g=v[0],_=v[1];b.a.chaptersCount().then((function(e){n(e)})).catch((function(e){}));var w=Object(p.useLiveQuery)(b.a.fetchPlayGameStateProps(["currentChapter","currentAct"],!0)),S=W.arrayToObject(w,"name");return Object(r.useEffect)((function(){S&&void 0!==S.currentChapter&&S.currentChapter.value!==x&&y(S.currentChapter.value),S&&void 0!==S.currentAct&&S.currentAct.value!==g&&_(S.currentAct.value)}),[S]),Object(r.useEffect)((function(){b.a.chapterByOrder(x).then((function(e){b.a.actsByChapterCount(e.id).then((function(e){j(e)})).catch((function(e){}))})).catch((function(e){}))}),[x]),Object(f.jsxs)(O.a,{children:[Object(f.jsx)(J,{level:5,children:"Progress"}),Object(f.jsxs)(o.a,{gutter:[8,8],children:[Object(f.jsxs)(i.a,{span:24,style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(f.jsx)(M.a,{percent:x/a*100,format:function(e){return"".concat(x,"/").concat(a)},strokeColor:"#fa541c"}),Object(f.jsx)(K,{type:"secondary",children:"Chapter"})]}),Object(f.jsxs)(i.a,{span:24,style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[Object(f.jsx)(M.a,{percent:g/u*100,format:function(e){return"".concat(g,"/").concat(u)},strokeColor:"#fa541c"}),Object(f.jsx)(K,{type:"secondary",children:"Act"})]})]})]})},R=a(120),H=n.a.Text,U=function(){var e=Object(r.useContext)(u.a),t=Object(c.a)(e,2),a=t[0],n=t[1];return Object(r.useEffect)((function(){j.a.checkDatabaseOk(n),j.a.checkStoryLoaded(n)}),[]),!a.initialCheckDone||a.globalLoading?Object(f.jsxs)("div",{className:"play-test-app loading",children:[Object(f.jsx)("img",{src:R.a,alt:"RPG Story Playtesting"}),Object(f.jsx)(s.a,{size:"large"})]}):a.databaseLoadError?Object(f.jsx)(H,{style:{display:"block",textAlign:"center",paddingTop:50},children:"This application requires IndexedDB. Please use a browser that supports this feature."}):a.storyLoadError?Object(f.jsxs)(H,{style:{display:"block",textAlign:"center",paddingTop:50},children:["We were unable to load your story, please go back to app editor and make sure your file/url contains a RPG-SP story.",Object(f.jsx)("br",{}),null!==a.storyErrorMessage&&"Error info: "+a.storyErrorMessage]}):Object(f.jsx)("div",{className:"play-test-app",children:Object(f.jsx)(l.a,{className:"app-layout",children:Object(f.jsxs)(o.a,{gutter:[16,16],className:"layout-row",children:[Object(f.jsx)(i.a,{span:6,className:"layout-col col-l",children:Object(f.jsx)(A,{})}),Object(f.jsx)(i.a,{span:11,className:"layout-col col-c",children:Object(f.jsx)(T,{})}),Object(f.jsxs)(i.a,{span:7,className:"layout-col col-r",children:[Object(f.jsx)(G,{}),Object(f.jsx)(Q,{})]})]})})})};a(382),a(383),t.default=function(){return Object(f.jsx)(u.b,{children:Object(f.jsx)(U,{})})}}}]);
//# sourceMappingURL=7.25c2ace4.chunk.js.map
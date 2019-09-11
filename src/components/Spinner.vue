<template>
<div align="center" class="cssload-fond">
	<div class="cssload-container-general">
			<div class="cssload-internal"><div class="cssload-ballcolor cssload-ball_1"> </div></div>
			<div class="cssload-internal"><div class="cssload-ballcolor cssload-ball_2"> </div></div>
			<div class="cssload-internal"><div class="cssload-ballcolor cssload-ball_3"> </div></div>
			<div class="cssload-internal"><div class="cssload-ballcolor cssload-ball_4"> </div></div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.cssload-fond{
    position: absolute;
    width: 100%;
	height: 100%;
	min-width: 1024px;
    background-color: rgba(0, 0, 0, 0.3);
    margin: auto;
    z-index: 3;
}

.cssload-container-general
{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -15px;
    margin-left: -15px;
	animation:cssload-animball_two 1.75s infinite;
		-o-animation:cssload-animball_two 1.75s infinite;
		-ms-animation:cssload-animball_two 1.75s infinite;
		-webkit-animation:cssload-animball_two 1.75s infinite;
		-moz-animation:cssload-animball_two 1.75s infinite;
	width:29px; height:29px;
}
.cssload-internal
{
	width:29px; height:29px; position:absolute;
}
.cssload-ballcolor
{
	width: 13px;
	height: 13px;
	border-radius: 50%;
}
.cssload-ball_1, .cssload-ball_2, .cssload-ball_3, .cssload-ball_4
{
	position: absolute;
	animation:cssload-animball_one 1.75s infinite ease;
		-o-animation:cssload-animball_one 1.75s infinite ease;
		-ms-animation:cssload-animball_one 1.75s infinite ease;
		-webkit-animation:cssload-animball_one 1.75s infinite ease;
		-moz-animation:cssload-animball_one 1.75s infinite ease;
}
.cssload-ball_1
{
	background-color:rgb(255,0,149);
	top:0; left:0;
}
.cssload-ball_2
{
	background-color:rgb(0,255,128);
	top:0; left:16px;
}
.cssload-ball_3
{
	background-color:rgb(0,255,234);
	top:16px; left:0;
}
.cssload-ball_4
{
	background-color:rgb(0,170,255);
	top:16px; left:16px;
}





@keyframes cssload-animball_one
{
	0%{ position: absolute;}
	50%{top:8px; left:8px; position: absolute;opacity:0.5;}
	100%{ position: absolute;}
}

@-o-keyframes cssload-animball_one
{
	0%{ position: absolute;}
	50%{top:8px; left:8px; position: absolute;opacity:0.5;}
	100%{ position: absolute;}
}

@-ms-keyframes cssload-animball_one
{
	0%{ position: absolute;}
	50%{top:8px; left:8px; position: absolute;opacity:0.5;}
	100%{ position: absolute;}
}

@-webkit-keyframes cssload-animball_one
{
	0%{ position: absolute;}
	50%{top:8px; left:8px; position: absolute;opacity:0.5;}
	100%{ position: absolute;}
}

@-moz-keyframes cssload-animball_one
{
	0%{ position: absolute;}
	50%{top:8px; left:8px; position: absolute;opacity:0.5;}
	100%{ position: absolute;}
}

@keyframes cssload-animball_two
{
	0%{transform:rotate(0deg) scale(1);}
	50%{transform:rotate(360deg) scale(1.3);}
	100%{transform:rotate(720deg) scale(1);}
}

@-o-keyframes cssload-animball_two
{
	0%{-o-transform:rotate(0deg) scale(1);}
	50%{-o-transform:rotate(360deg) scale(1.3);}
	100%{-o-transform:rotate(720deg) scale(1);}
}

@-ms-keyframes cssload-animball_two
{
	0%{-ms-transform:rotate(0deg) scale(1);}
	50%{-ms-transform:rotate(360deg) scale(1.3);}
	100%{-ms-transform:rotate(720deg) scale(1);}
}

@-webkit-keyframes cssload-animball_two
{
	0%{-webkit-transform:rotate(0deg) scale(1);}
	50%{-webkit-transform:rotate(360deg) scale(1.3);}
	100%{-webkit-transform:rotate(720deg) scale(1);}
}

@-moz-keyframes cssload-animball_two
{
	0%{-moz-transform:rotate(0deg) scale(1);}
	50%{-moz-transform:rotate(360deg) scale(1.3);}
	100%{-moz-transform:rotate(720deg) scale(1);}
}
</style>
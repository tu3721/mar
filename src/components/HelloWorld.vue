<template>
  <div>
    <div>
      <div id="pano"></div>
      <div v-show="show">
        <a href="javascript:void(0)" id="autorotateToggle">
          <img class="icon off" src="@/assets/img/play.png">
          <img class="icon on" src="@/assets/img/pause.png">
        </a>
        <a href="javascript:void(0)" id="fullscreenToggle">
          <img class="icon off" src="@/assets/img/fullscreen.png">
          <img class="icon on" src="@/assets/img/windowed.png">
        </a>
        <a href="javascript:void(0)" id="viewUp" class="viewControlButton viewControlButton-1">
          <img class="icon" src="@/assets/img/up.png">
        </a>
        <a href="javascript:void(0)" id="viewDown" class="viewControlButton viewControlButton-2">
          <img class="icon" src="@/assets/img/down.png">
        </a>
        <a href="javascript:void(0)" id="viewLeft" class="viewControlButton viewControlButton-3">
          <img class="icon" src="@/assets/img/left.png">
        </a>
        <a href="javascript:void(0)" id="viewRight" class="viewControlButton viewControlButton-4">
          <img class="icon" src="@/assets/img/right.png">
        </a>
        <a href="javascript:void(0)" id="viewIn" class="viewControlButton viewControlButton-5">
          <img class="icon" src="@/assets/img/plus.png">
        </a>
        <a href="javascript:void(0)" id="viewOut" class="viewControlButton viewControlButton-6">
          <img class="icon" src="@/assets/img/minus.png">
        </a>
      </div>

    </div>
  </div>
</template>

<script>
  import { getImg } from "../router/request";
  import utils from '../utils/util';
  import * as Marzipano from 'marzipano'
  var viewer = '';
  var autorotateToggleElement = '';
  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI/2
  });
  var stage = '';
  var viewUpElement = '';
  var viewDownElement = '';
  var viewLeftElement = '';
  var viewRightElement = '';
  var viewInElement = '';
  var viewOutElement = '';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        show:false,
        settings: {
          "autorotateEnabled": true,
        },
      }
    },
    created() {
      this.getImgUrl();
      // this.init('renderingLibraryProd/f2e6f0a7ba3eeb1f2713b30851edd2dd/20211224/RenderingNo1Work_2021_12_24_18_25_5_812.jpg');
    },
    methods:{
      getImgUrl(){
        this.$nextTick(() => {
          console.log(utils);
          if (this.$route.query.scene_id){
            let dt = {
              scene_id:this.$route.query.scene_id
            }
            var viewerElement = document.getElementById('pano');
            var dom = '';
            getImg(dt).then(res => {
              console.log(res);
              if (res.data.ImageTypes == 0){
                //平面图
                dom=document.createElement('img');
                // let url = 'https://mx-renderinglibrary.oss-cn-hangzhou.aliyuncs.com/';
                dom.src = res.data.url + res.data.path;
                dom.style.width = '100%';
                dom.style.height = '100%';
                viewerElement.appendChild(dom);
              }else if (res.data.ImageTypes == 1){
                //全景图
                this.init(res.data.path,res.data.url);
              }else{
                dom=document.createElement('p');
                dom.innerHTML='图片类型错误';
                viewerElement.appendChild(dom);
              }
            })
          }
        })
      },
      init(path,url){
        let _this = this;
        this.$nextTick(() => {
          // let url = process.env.NODE_ENV == 'production' ? 'https://mx-renderinglibrary.oss-cn-hangzhou.aliyuncs.com/' : '/img';
          var imageUrl = url + path;
          // console.log(image);
          this.show = true;

          // var imageUrl = '/test.jpg';
          var viewerElement = document.getElementById('pano');
          // Create viewer.
          viewer = new Marzipano.Viewer(viewerElement);
          // Get stage.
          stage = viewer.stage();
          // Create layers and add them into stage.
          // var imageUrl = "/test.jpg";
          _this.createEditableLayers(stage,imageUrl,function (err, layers) {
            if (err) {
              var dom=document.createElement('p');
              dom.innerHTML='图片加载失败';
              viewerElement.appendChild(dom);
              throw err;
            }
            stage.addLayer(layers.colorLayer);
            stage.addLayer(layers.bwLayer);

          })

          //底部导航设置
          viewUpElement = document.querySelector('#viewUp');
          viewDownElement = document.querySelector('#viewDown');
          viewLeftElement = document.querySelector('#viewLeft');
          viewRightElement = document.querySelector('#viewRight');
          viewInElement = document.querySelector('#viewIn');
          viewOutElement = document.querySelector('#viewOut');
          // Dynamic parameters for controls.
          var velocity = 0.7;
          var friction = 3;
          // Associate view controls with elements.
          var controls = viewer.controls();
          controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
          controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
          controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
          controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
          controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
          controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);
          autorotateToggleElement = document.querySelector('#autorotateToggle');
          //右上角自动旋转开关
          if (_this.settings.autorotateEnabled) {
            autorotateToggleElement.classList.add('enabled');
          }
          autorotateToggleElement.addEventListener('click', _this.toggleAutorotate);
        })

      },
      toggleAutorotate() {
        if (autorotateToggleElement.classList.contains('enabled')) {
          autorotateToggleElement.classList.remove('enabled');
          this.stopAutorotate();
        } else {
          autorotateToggleElement.classList.add('enabled');
          this.startAutorotate();
        }
      },
      stopAutorotate() {
        viewer.stopMovement();
        viewer.setIdleMovement(Infinity);
      },
      startAutorotate() {
        if (!autorotateToggleElement.classList.contains('enabled')) {
          return;
        }
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(1000, autorotate);
      },
      createEditableLayers(stage, url, done) {
        let _this = this;
        this.urlToCanvas(url, function(err, colorCanvas) {
          if (err) {
            done(err);
            return;
          }
          // Make a desaturated copy of the canvas.
          var bwCanvas = _this.desaturateCanvas(colorCanvas);
          // Create common geometry and view.
          var geometry = new Marzipano.EquirectGeometry([{ width: colorCanvas.width }]);
          var limiter = Marzipano.RectilinearView.limit.traditional(colorCanvas.width/4 * 1.5, 100*Math.PI/180);
          var view = new Marzipano.RectilinearView(null, limiter);

          // Create color layer.
          var colorAsset = new Marzipano.DynamicAsset(colorCanvas);
          var colorSource = new Marzipano.SingleAssetSource(colorAsset);
          var colorTextureStore = new Marzipano.TextureStore(colorSource, stage);
          var colorLayer = new Marzipano.Layer(colorSource, geometry, view, colorTextureStore);
          // Create desaturated layer.
          var bwAsset = new Marzipano.DynamicAsset(bwCanvas);
          var bwSource = new Marzipano.SingleAssetSource(bwAsset);
          var bwTextureStore = new Marzipano.TextureStore(bwSource, stage);
          var bwLayer = new Marzipano.Layer(bwSource, geometry, view, bwTextureStore);

          //设置自动循环的开始scene
          var source = new Marzipano.ImageUrlSource(function(tile) {
            console.log(tile);
            return { url: url };
          });
          var scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
          });
          viewer.switchScene(scene);

          //开始自动循环
          _this.startAutorotate();
          done(null, {
            colorLayer: colorLayer,
            bwLayer: bwLayer
          });
        });

      },
      urlToCanvas(url, done) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          done(null, canvas);
        };
        img.onerror = function(e) {
          done(e);
        };
        img.crossOrigin = 'anonymous';
        img.src = url;
      },
      desaturateCanvas(original) {
        var canvas = document.createElement('canvas');
        canvas.width = original.width;
        canvas.height = original.height;
        var ctx = canvas.getContext('2d');
        var imageData = original.getContext('2d').getImageData(0, 0, original.width, original.height);
        // Marzipano.colorEffects.applyToImageData(imageData, colorEffects.saturation(0));
        ctx.putImageData(imageData, 0, 0);
        return canvas;
      },


    },




  }
</script>

<style>

  a, a:hover, a:active, a:visited {
    text-decoration: none;
    color: inherit;
  }

  #pano {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #fullscreenToggle {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    padding: 5px;
    background-color: rgb(103,115,131);
    background-color: rgba(103,115,131,0.8);
  }

  .mobile #fullscreenToggle {
    width: 50px;
    height: 50px;
  }

  body.fullscreen-enabled #fullscreenToggle {
    display: block;
  }

  #fullscreenToggle .icon {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
  }

  .mobile #fullscreenToggle .icon {
    top: 10px;
    right: 10px;
  }

  #fullscreenToggle .icon.on {
    display: none;
  }

  #fullscreenToggle .icon.off {
    display: block;
  }

  #fullscreenToggle.enabled .icon.on {
    display: block;
  }

  #fullscreenToggle.enabled .icon.off {
    display: none;
  }

  #autorotateToggle {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    padding: 5px;
    background-color: rgb(103,115,131);
    background-color: rgba(103,115,131,0.8);
  }

  .mobile #autorotateToggle {
    width: 50px;
    height: 50px;
  }

  /* If there is a fullscreen button, autorotate must placed a bit to the left */
  body.fullscreen-enabled #autorotateToggle {
    right: 40px;
  }

  body.fullscreen-enabled.mobile #autorotateToggle {
    right: 50px;
  }

  #autorotateToggle .icon {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
  }

  .mobile #autorotateToggle .icon {
    top: 10px;
    right: 10px;
  }

  #autorotateToggle .icon.on {
    display: none;
  }

  #autorotateToggle .icon.off {
    display: block;
  }

  #autorotateToggle.enabled .icon.on {
    display: block;
  }

  #autorotateToggle.enabled .icon.off {
    display: none;
  }


  /* Link hotspot */

  .link-hotspot {
    width: 60px;
    height: 60px;
    margin-left: -30px;
    margin-top: -30px;
    opacity: 0.9;
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
  }

  .no-touch .link-hotspot:hover {
    opacity: 1;
  }

  .mobile .link-hotspot {
    width: 70px;
    height: 70px;
  }

  .link-hotspot-icon {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .link-hotspot-tooltip {
    position: absolute;
    left: 100%;
    top: 14px; /* ( 60 - (16 + 2*8) ) / 2 */

    margin-left: 3px;

    font-size: 16px;

    max-width: 300px;

    padding: 8px 10px;

    border-radius: 5px;

    background-color: rgb(58,68,84);
    background-color: rgba(58,68,84,0.8);

    color: #fff;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    cursor: pointer;

    opacity: 0;

    -ms-transform: translateX(-8px);
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);

    -webkit-transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    opacity 0.3s;
    transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    opacity 0.3s;
  }

  .mobile .link-hotspot {
    top: 19px; /* ( 70 - (16 + 2*8) ) / 2 */
  }

  .no-touch .link-hotspot:hover .link-hotspot-tooltip {
    opacity: 1;
    -ms-transform: translateX(0);
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  /* Prevent tooltip from triggering */
  .link-hotspot-tooltip {
    pointer-events: none;
  }
  .no-touch .link-hotspot:hover .link-hotspot-tooltip {
    pointer-events: all;
  }

  /* Fallback mode without pointer-events (IE8-10) */
  .tooltip-fallback .link-hotspot-tooltip {
    display: none;
  }
  .no-touch .tooltip-fallback .link-hotspot:hover .link-hotspot-tooltip {
    display: block;
  }

  /* Info hotspot */

  .info-hotspot {
    line-height: 1.2em;
    opacity: 0.9;
    -webkit-transition: opacity 0.2s 0.2s;
    transition: opacity 0.2s 0.2s;
  }

  .no-touch .info-hotspot:hover {
    opacity: 1;
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
  }

  .info-hotspot.visible {
    opacity: 1;
  }

  .info-hotspot .info-hotspot-header {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: rgb(103,115,131);
    cursor: pointer;
    -webkit-transition: width 0.3s ease-in-out 0.5s,
    border-radius 0.3s ease-in-out 0.5s;
    transition: width 0.3s ease-in-out 0.5s,
    border-radius 0.3s ease-in-out 0.5s;
  }

  .mobile .info-hotspot .info-hotspot-header {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }

  .desktop.no-touch .info-hotspot .info-hotspot-header:hover {
    width: 260px;
    border-radius: 5px;
    -webkit-transition: width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
    transition: width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  }

  .desktop .info-hotspot.visible .info-hotspot-header,
  .desktop.no-touch .info-hotspot.visible .info-hotspot-header:hover {
    width: 260px;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    -webkit-transition: width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
    transition: width 0.3s ease-in-out,
    border-radius 0.3s ease-in-out;
  }

  .info-hotspot .info-hotspot-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .mobile .info-hotspot .info-hotspot-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .info-hotspot .info-hotspot-icon {
    width: 90%;
    height: 90%;
    margin: 5%;
  }

  .info-hotspot .info-hotspot-title-wrapper {
    position: absolute;
    left: 40px;
    top: 0;
    width: 0;
    height: 40px;
    padding: 0;
    overflow: hidden;
    -webkit-transition: width 0s 0.4s,
    padding 0s 0.4s;
    transition: width 0s 0.4s,
    padding 0s 0.4s;
  }

  .desktop .info-hotspot.visible .info-hotspot-title-wrapper,
  .desktop.no-touch .info-hotspot .info-hotspot-header:hover .info-hotspot-title-wrapper {
    width: 220px;
    padding: 0 5px;
    -webkit-transition: width 0s 0.4s,
    padding 0s 0.4s;
    transition: width 0s 0.4s,
    padding 0s 0.4s;
  }

  .info-hotspot .info-hotspot-title-wrapper:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }

  .info-hotspot .info-hotspot-title {
    display: inline-block;
    vertical-align: middle;

    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .info-hotspot .info-hotspot-close-wrapper {
    position: absolute;
    left: 260px;
    top: 0;
    height: 40px;
    width: 40px;
    border-top-right-radius: 5px;
    background-color: rgb(78,88,104);
    visibility: hidden;
    -ms-transform: perspective(200px) rotateY(90deg);
    -webkit-transform: perspective(200px) rotateY(90deg);
    transform: perspective(200px) rotateY(90deg);
    -ms-transform-origin: 0 50% 0;
    -webkit-transform-origin: 0 50% 0;
    transform-origin: 0 50% 0;
    -webkit-transition: -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0.6s;
    transition: -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0.6s;
  }

  .desktop .info-hotspot.visible .info-hotspot-close-wrapper {
    visibility: visible;
    -ms-transform: perspective(200px) rotateY(0deg);
    -webkit-transform: perspective(200px) rotateY(0deg);
    transform: perspective(200px) rotateY(0deg);
    -webkit-transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0s;
    transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0s;
  }

  .info-hotspot .info-hotspot-close-icon {
    width: 70%;
    height: 70%;
    margin: 15%;
  }

  .info-hotspot .info-hotspot-text {
    position: absolute;
    width: 300px;
    height: auto;
    max-height: 200px;
    top: 40px;
    left: 0;
    padding: 10px;
    background-color: rgb(58,68,84);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow-y: auto;
    visibility: hidden;
    /* rotate(90deg) causes transition flicker on Firefox 58 */
    -ms-transform: perspective(200px) rotateX(-89.999deg);
    -webkit-transform: perspective(200px) rotateX(-89.999deg);
    transform: perspective(200px) rotateX(-89.999deg);
    -ms-transform-origin: 50% 0 0;
    -webkit-transform-origin: 50% 0 0;
    transform-origin: 50% 0 0;
    -webkit-transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0.3s;
    transition: -ms-transform 0.3s,
    -webkit-transform 0.3s,
    transform 0.3s,
    visibility 0s 0.3s;

    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .desktop .info-hotspot.visible .info-hotspot-text {
    visibility: visible;
    -ms-transform: perspective(200px) rotateX(0deg);
    -webkit-transform: perspective(200px) rotateX(0deg);
    transform: perspective(200px) rotateX(0deg);
    -webkit-transition: -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0s;
    transition: -ms-transform 0.3s 0.3s,
    -webkit-transform 0.3s 0.3s,
    transform 0.3s 0.3s,
    visibility 0s 0s;
  }

  /* Info hotspot modal */

  .desktop .info-hotspot-modal {
    display: none;
  }

  .info-hotspot-modal {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 11000 !important;
    background-color: rgba(0,0,0,.5);
    line-height: 1.2em;
    opacity: 0;
    visibility: hidden;
    -webkit-transition: opacity 0.2s ease-in-out 0.5s,
    visibility 0s 0.7s;
    transition: opacity 0.2s ease-in-out 0.5s,
    visibility 0s 0.7s;
  }

  .info-hotspot-modal.visible {
    opacity: 1;
    visibility: visible;
    -webkit-transition: opacity 0.2s ease-in-out,
    visibility 0s 0s;
    transition: opacity 0.2s ease-in-out,
    visibility 0s 0s;
  }

  .info-hotspot-modal .info-hotspot-header {
    position: absolute;
    top: 60px;
    left: 10px;
    right: 10px;
    width: auto;
    height: 50px;
    background-color: rgb(103,115,131);
    background-color: rgba(103,115,131,0.8);
    opacity: 0;
    -webkit-transition: opacity 0.3s ease-in-out 0.2s;
    transition: opacity 0.3s ease-in-out 0.2s;
  }

  .info-hotspot-modal.visible .info-hotspot-header {
    opacity: 1;
    -webkit-transition: opacity 0.3s ease-in-out 0.2s;
    transition: opacity 0.3s ease-in-out 0.2s;
  }

  .info-hotspot-modal .info-hotspot-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .info-hotspot-modal .info-hotspot-icon {
    width: 90%;
    height: 90%;
    margin: 5%;
  }

  .info-hotspot-modal .info-hotspot-title-wrapper {
    position: absolute;
    top: 0;
    left: 50px;
    right: 50px;
    width: auto;
    height: 50px;
    padding: 0 10px;
  }

  .info-hotspot-modal .info-hotspot-title-wrapper:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }

  .info-hotspot-modal .info-hotspot-title {
    display: inline-block;
    vertical-align: middle;

    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .info-hotspot-modal .info-hotspot-close-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background-color: rgb(78,88,104);
    background-color: rgba(78,88,104,0.8);
    cursor: pointer;
  }

  .info-hotspot-modal .info-hotspot-close-icon {
    width: 70%;
    height: 70%;
    margin: 15%;
  }

  .info-hotspot-modal .info-hotspot-text {
    position: absolute;
    top: 110px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    padding: 10px;
    background-color: rgb(58,68,84);
    background-color: rgba(58,68,84,0.8);
    overflow-y: auto;
    opacity: 0;
    -webkit-transition: opacity 0.3s ease-in-out;
    transition: opacity 0.3s ease-in-out;

    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .info-hotspot-modal.visible .info-hotspot-text {
    opacity: 1;
    -webkit-transition: opacity 0.3s ease-in-out 0.4s;
    transition: opacity 0.3s ease-in-out 0.4s;
  }

  /* View control buttons */

  .viewControlButton {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 40px;
    height: 40px;
    padding: 5px;
    background-color: rgb(103,115,131);
    background-color: rgba(103,115,131,0.8);
  }

  body.view-control-buttons .viewControlButton {
    display: block;
  }

  /* Hide controls when width is too small */
  @media (max-width: 600px) {
    body.view-control-buttons .viewControlButton {
      display: none;
    }
  }

  .viewControlButton .icon {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
  }

  /* Center is at margin-left: -20px */
  .viewControlButton-1 {
    margin-left: -145px;
  }
  .viewControlButton-2 {
    margin-left: -95px;
  }
  .viewControlButton-3 {
    margin-left: -45px;
  }
  .viewControlButton-4 {
    margin-left: 5px;
  }
  .viewControlButton-5 {
    margin-left: 55px;
  }
  .viewControlButton-6 {
    margin-left: 105px;
  }

</style>

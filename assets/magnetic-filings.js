(function () {
  var canvas = document.getElementById('filings-canvas');
  var ctx = canvas.getContext('2d');

  var SPACING = 48;
  var W = 18;
  var H = 3;
  var LERP = 0.07;

  var mouse = { x: -9999, y: -9999 };
  var filings = [];

  function lerpAngle(current, target) {
    var diff = target - current;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return current + diff * LERP;
  }

  function getFilingColor() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(75, 76, 77, 0.03)';
  }

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    filings = [];
    var cols = Math.ceil(canvas.width / SPACING) + 1;
    var rows = Math.ceil(canvas.height / SPACING) + 1;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        filings.push({
          x: c * SPACING + SPACING / 2,
          y: r * SPACING + SPACING / 2,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var color = getFilingColor();

    for (var i = 0; i < filings.length; i++) {
      var f = filings[i];
      f.angle = lerpAngle(f.angle, Math.atan2(mouse.y - f.y, mouse.x - f.x));

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-W / 2, -H / 2, W, H, H / 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', init);

  init();
  draw();
})();

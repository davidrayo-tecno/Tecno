/*
 * RayoBlocks · biblioteca de objetos, fondos y sonidos.
 * Todos los dibujos son originales de RayoBlocks (SVG). Los sonidos se sintetizan en el navegador.
 * Los objetos miran hacia la derecha (dirección 90), como es costumbre en la programación por bloques.
 */
(function () {
  'use strict';

  var ojos = function (x1, x2, y, r) {
    return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#fff"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#fff"/>' +
      '<circle cx="' + (x1 + 1.5) + '" cy="' + (y + 1) + '" r="' + (r * 0.55) + '" fill="#1B2140"/><circle cx="' + (x2 + 1.5) + '" cy="' + (y + 1) + '" r="' + (r * 0.55) + '" fill="#1B2140"/>';
  };
  function svg(w, h, cuerpo) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + cuerpo + '</svg>';
  }

  var RAYO = 'M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z';

  var OBJETOS = [
    { nombre: 'Chispa', disfraces: [
      { nombre: 'chispa-a', svg: svg(96, 118,
        '<path d="' + RAYO + '" fill="#FFC93C" stroke="#E08A00" stroke-width="5" stroke-linejoin="round"/>' +
        ojos(40, 56, 40, 6.5) + '<path d="M40 54 Q49 62 58 53" fill="none" stroke="#1B2140" stroke-width="3.5" stroke-linecap="round"/>' +
        '<circle cx="33" cy="51" r="3.5" fill="#FF8A65" opacity=".7"/><circle cx="64" cy="49" r="3.5" fill="#FF8A65" opacity=".7"/>') },
      { nombre: 'chispa-b', svg: svg(96, 118,
        '<path d="' + RAYO + '" fill="#FFD95E" stroke="#E08A00" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M34 41 q6 -6 12 0 M50 41 q6 -6 12 0" fill="none" stroke="#1B2140" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M38 52 Q49 66 60 51 Z" fill="#1B2140"/>' +
        '<path d="M84 14 l4 8 8 3 -8 3 -4 8 -4 -8 -8 -3 8 -3z M10 84 l3 6 6 2 -6 2 -3 6 -3 -6 -6 -2 6 -2z" fill="#FFC93C"/>') }
    ] },
    // RayoMan: el profe David Rayo Torres convertido en superhéroe (antifaz, camiseta con Chispa y capa)
    { nombre: 'RayoMan', disfraces: [
      { nombre: "rayoman-frente", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"110\" height=\"152\" viewBox=\"0 0 110 152\"><path d=\"M33 68 C21 106 19 132 25 142 L85 142 C91 132 89 106 77 68 Z\" fill=\"#1E2A5A\"/><rect x=\"40\" y=\"110\" width=\"13\" height=\"30\" rx=\"4\" fill=\"#3A4A6E\"/><rect x=\"57\" y=\"110\" width=\"13\" height=\"30\" rx=\"4\" fill=\"#3A4A6E\"/><ellipse cx=\"46\" cy=\"142\" rx=\"10\" ry=\"5\" fill=\"#22272E\"/><ellipse cx=\"64\" cy=\"142\" rx=\"10\" ry=\"5\" fill=\"#22272E\"/><path d=\"M76 74 C83 80 85 94 84 106\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"84\" cy=\"108\" r=\"5.5\" fill=\"#F2C6A5\"/><path d=\"M34 74 C27 80 25 94 26 106\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"26\" cy=\"108\" r=\"5.5\" fill=\"#F2C6A5\"/><path d=\"M33 68 Q55 63 77 68 L85 82 L78 86 L76 113 L34 113 L32 86 L25 82 Z\" fill=\"#16181D\"/><path d=\"M48 67 Q55 73 62 67\" fill=\"#F2C6A5\"/><g transform=\"translate(46 78) scale(0.19)\"><path d=\"M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z\" fill=\"#FFC93C\" stroke=\"#E08A00\" stroke-width=\"6\" stroke-linejoin=\"round\"/><circle cx=\"40\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"56\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"41.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><circle cx=\"57.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><path d=\"M40 55 Q49 63 58 54\" fill=\"none\" stroke=\"#1B2140\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><circle cx=\"36\" cy=\"70\" r=\"3\" fill=\"#FFC93C\"/><circle cx=\"74\" cy=\"70\" r=\"3\" fill=\"#FFC93C\"/><rect x=\"49\" y=\"58\" width=\"12\" height=\"10\" fill=\"#F2C6A5\"/><ellipse cx=\"34\" cy=\"40\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><ellipse cx=\"76\" cy=\"40\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M35 32 C34 8 76 8 75 32 L74 50 C72 66 38 66 36 50 Z\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M36 40 C36 52 40 65 55 66 C70 65 74 52 74 40 C71 48 66 50 63 49 L47 49 C44 50 39 48 36 40 Z\" fill=\"#A3A3A3\" opacity=\".95\"/><path d=\"M46 51 C50 47 60 47 64 51 C60 50 50 50 46 51 Z\" fill=\"#5F5F5F\"/><path d=\"M49 57 C51 64 59 64 61 57 Z\" fill=\"#5F5F5F\" opacity=\".75\"/><path d=\"M50 53.5 Q55 56 60 53.5\" stroke=\"#8A4B3B\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M55 36 L52 45 Q55 47 58 45\" fill=\"none\" stroke=\"#D9A585\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><path d=\"M40 25 Q46 22 51 25 M59 25 Q64 22 70 25\" stroke=\"#5E5E5E\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 32 C35 26 45 26 52 30 Q55 32 58 30 C65 26 75 26 77 32 C76 40 67 42 60 38 Q55 36 50 38 C43 42 34 40 33 32 Z\" fill=\"#111\"/><ellipse cx=\"45.5\" cy=\"33\" rx=\"5\" ry=\"3.6\" fill=\"#fff\"/><ellipse cx=\"64.5\" cy=\"33\" rx=\"5\" ry=\"3.6\" fill=\"#fff\"/><circle cx=\"46\" cy=\"33.2\" r=\"2.4\" fill=\"#3B2A20\"/><circle cx=\"65\" cy=\"33.2\" r=\"2.4\" fill=\"#3B2A20\"/><path d=\"M34 34 C31 18 37 5 49 3 C53 -1 63 -1 68 3 C76 6 80 18 76 34 C74 24 72 18 67 16 C59 13 49 13 42 16 C37 19 35 25 34 34 Z\" fill=\"#8C8C8C\"/><path d=\"M43 10 q4 -4 9 -3 M53 7 q5 -3 10 0 M64 9 q4 0 7 4 M38 18 q2 -5 6 -6\" stroke=\"#C9C9C9\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>" },
      { nombre: "rayoman-saluda", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"110\" height=\"152\" viewBox=\"0 0 110 152\"><path d=\"M33 68 C21 106 19 132 25 142 L85 142 C91 132 89 106 77 68 Z\" fill=\"#1E2A5A\"/><rect x=\"40\" y=\"110\" width=\"13\" height=\"30\" rx=\"4\" fill=\"#3A4A6E\"/><rect x=\"57\" y=\"110\" width=\"13\" height=\"30\" rx=\"4\" fill=\"#3A4A6E\"/><ellipse cx=\"46\" cy=\"142\" rx=\"10\" ry=\"5\" fill=\"#22272E\"/><ellipse cx=\"64\" cy=\"142\" rx=\"10\" ry=\"5\" fill=\"#22272E\"/><path d=\"M76 74 C83 80 85 94 84 106\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><circle cx=\"84\" cy=\"108\" r=\"5.5\" fill=\"#F2C6A5\"/><path d=\"M34 74 C25 68 21 56 22 42\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><g transform=\"translate(22 37) rotate(-12)\"><rect x=\"-6\" y=\"-7\" width=\"12\" height=\"13\" rx=\"5\" fill=\"#F2C6A5\"/><path d=\"M-5 -6v-6M-1.5 -7v-7M2 -7v-6.5M5 -5v-5\" stroke=\"#F2C6A5\" stroke-width=\"3\" stroke-linecap=\"round\"/></g><path d=\"M11 36 q-3 4 0 8 M7 33 q-4 7 0 13\" stroke=\"#5CC8FF\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 68 Q55 63 77 68 L85 82 L78 86 L76 113 L34 113 L32 86 L25 82 Z\" fill=\"#16181D\"/><path d=\"M48 67 Q55 73 62 67\" fill=\"#F2C6A5\"/><g transform=\"translate(46 78) scale(0.19)\"><path d=\"M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z\" fill=\"#FFC93C\" stroke=\"#E08A00\" stroke-width=\"6\" stroke-linejoin=\"round\"/><circle cx=\"40\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"56\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"41.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><circle cx=\"57.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><path d=\"M40 55 Q49 63 58 54\" fill=\"none\" stroke=\"#1B2140\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><circle cx=\"36\" cy=\"70\" r=\"3\" fill=\"#FFC93C\"/><circle cx=\"74\" cy=\"70\" r=\"3\" fill=\"#FFC93C\"/><rect x=\"49\" y=\"58\" width=\"12\" height=\"10\" fill=\"#F2C6A5\"/><ellipse cx=\"34\" cy=\"40\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><ellipse cx=\"76\" cy=\"40\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M35 32 C34 8 76 8 75 32 L74 50 C72 66 38 66 36 50 Z\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M36 40 C36 52 40 65 55 66 C70 65 74 52 74 40 C71 48 66 50 63 49 L47 49 C44 50 39 48 36 40 Z\" fill=\"#A3A3A3\" opacity=\".95\"/><path d=\"M46 51 C50 47 60 47 64 51 C60 50 50 50 46 51 Z\" fill=\"#5F5F5F\"/><path d=\"M49 57 C51 64 59 64 61 57 Z\" fill=\"#5F5F5F\" opacity=\".75\"/><path d=\"M50 53.5 Q55 56 60 53.5\" stroke=\"#8A4B3B\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M55 36 L52 45 Q55 47 58 45\" fill=\"none\" stroke=\"#D9A585\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><path d=\"M40 25 Q46 22 51 25 M59 25 Q64 22 70 25\" stroke=\"#5E5E5E\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 32 C35 26 45 26 52 30 Q55 32 58 30 C65 26 75 26 77 32 C76 40 67 42 60 38 Q55 36 50 38 C43 42 34 40 33 32 Z\" fill=\"#111\"/><ellipse cx=\"45.5\" cy=\"33\" rx=\"5\" ry=\"3.6\" fill=\"#fff\"/><ellipse cx=\"64.5\" cy=\"33\" rx=\"5\" ry=\"3.6\" fill=\"#fff\"/><circle cx=\"46\" cy=\"33.2\" r=\"2.4\" fill=\"#3B2A20\"/><circle cx=\"65\" cy=\"33.2\" r=\"2.4\" fill=\"#3B2A20\"/><path d=\"M34 34 C31 18 37 5 49 3 C53 -1 63 -1 68 3 C76 6 80 18 76 34 C74 24 72 18 67 16 C59 13 49 13 42 16 C37 19 35 25 34 34 Z\" fill=\"#8C8C8C\"/><path d=\"M43 10 q4 -4 9 -3 M53 7 q5 -3 10 0 M64 9 q4 0 7 4 M38 18 q2 -5 6 -6\" stroke=\"#C9C9C9\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>" },
      { nombre: "rayoman-perfil-1", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"104\" height=\"152\" viewBox=\"0 0 104 152\"><path d=\"M42 67 C20 96 16 126 24 144 L52 140 C48 116 52 86 58 69 Z\" fill=\"#1E2A5A\"/><path d=\"M50 110 L38 140\" stroke=\"#2E3B59\" stroke-width=\"12\" stroke-linecap=\"round\"/><ellipse cx=\"43\" cy=\"143\" rx=\"10\" ry=\"4.8\" fill=\"#22272E\"/><path d=\"M50 110 L64 140\" stroke=\"#3A4A6E\" stroke-width=\"12\" stroke-linecap=\"round\"/><ellipse cx=\"69\" cy=\"143\" rx=\"10\" ry=\"4.8\" fill=\"#22272E\"/><path d=\"M48 76 L36 104\" stroke=\"#D9A585\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M36 68 Q50 63 64 68 L66 113 L36 113 Z\" fill=\"#16181D\"/><g transform=\"translate(48 78) scale(0.15)\"><path d=\"M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z\" fill=\"#FFC93C\" stroke=\"#E08A00\" stroke-width=\"6\" stroke-linejoin=\"round\"/><circle cx=\"40\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"56\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"41.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><circle cx=\"57.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><path d=\"M40 55 Q49 63 58 54\" fill=\"none\" stroke=\"#1B2140\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><path d=\"M52 74 C52 86 66 96 68 104\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M42 69 L58 69 L62 86 L46 86 Z\" fill=\"#16181D\"/><rect x=\"45\" y=\"58\" width=\"11\" height=\"10\" fill=\"#F2C6A5\"/><path d=\"M33 32 C32 8 68 6 69 30 L71 36 L77 43 L71 46 L70 52 C66 65 48 67 40 60 C34 54 32 44 33 32 Z\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M38 44 C42 56 48 65 56 65 C64 64 69 58 70 51 L69 49 C64 50 59 48 56 47 C50 48 44 46 38 44 Z\" fill=\"#A3A3A3\"/><path d=\"M61 49 C65 47 69 48 70 50 C66 50 63 51 61 49 Z\" fill=\"#5F5F5F\"/><path d=\"M62 59 C64 63 68 62 69 57 Z\" fill=\"#5F5F5F\" opacity=\".7\"/><path d=\"M63 53.5 L69 53\" stroke=\"#8A4B3B\" stroke-width=\"2\" stroke-linecap=\"round\"/><ellipse cx=\"44\" cy=\"39\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M33 29 L71 28 C72 35 70 38 66 38 C61 38 58 36 55 37 L33 36 Z\" fill=\"#111\"/><path d=\"M33 31 l-9 -4 l2 6 l-3 5 l10 -3 Z\" fill=\"#111\"/><ellipse cx=\"63\" cy=\"33\" rx=\"4.6\" ry=\"3.4\" fill=\"#fff\"/><circle cx=\"65\" cy=\"33.2\" r=\"2.3\" fill=\"#3B2A20\"/><path d=\"M57 24 Q63 21 69 24\" stroke=\"#5E5E5E\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 35 C29 16 38 4 50 3 C58 1 68 5 70 14 C71 19 69 21 66 19 C58 15 48 16 42 20 C39 26 38 30 36 35 Z\" fill=\"#8C8C8C\"/><path d=\"M42 9 q5 -4 11 -3 M55 7 q6 -1 10 3 M36 20 q2 -6 7 -8\" stroke=\"#C9C9C9\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>" },
      { nombre: "rayoman-perfil-2", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"104\" height=\"152\" viewBox=\"0 0 104 152\"><path d=\"M42 67 C20 96 16 126 24 144 L52 140 C48 116 52 86 58 69 Z\" fill=\"#1E2A5A\"/><path d=\"M50 110 L56 140\" stroke=\"#2E3B59\" stroke-width=\"12\" stroke-linecap=\"round\"/><ellipse cx=\"61\" cy=\"143\" rx=\"10\" ry=\"4.8\" fill=\"#22272E\"/><path d=\"M50 110 L44 140\" stroke=\"#3A4A6E\" stroke-width=\"12\" stroke-linecap=\"round\"/><ellipse cx=\"49\" cy=\"143\" rx=\"10\" ry=\"4.8\" fill=\"#22272E\"/><path d=\"M48 76 L60 104\" stroke=\"#D9A585\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M36 68 Q50 63 64 68 L66 113 L36 113 Z\" fill=\"#16181D\"/><g transform=\"translate(48 78) scale(0.15)\"><path d=\"M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z\" fill=\"#FFC93C\" stroke=\"#E08A00\" stroke-width=\"6\" stroke-linejoin=\"round\"/><circle cx=\"40\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"56\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"41.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><circle cx=\"57.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><path d=\"M40 55 Q49 63 58 54\" fill=\"none\" stroke=\"#1B2140\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><path d=\"M52 74 C52 86 42 96 40 104\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M42 69 L58 69 L62 86 L46 86 Z\" fill=\"#16181D\"/><rect x=\"45\" y=\"58\" width=\"11\" height=\"10\" fill=\"#F2C6A5\"/><path d=\"M33 32 C32 8 68 6 69 30 L71 36 L77 43 L71 46 L70 52 C66 65 48 67 40 60 C34 54 32 44 33 32 Z\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M38 44 C42 56 48 65 56 65 C64 64 69 58 70 51 L69 49 C64 50 59 48 56 47 C50 48 44 46 38 44 Z\" fill=\"#A3A3A3\"/><path d=\"M61 49 C65 47 69 48 70 50 C66 50 63 51 61 49 Z\" fill=\"#5F5F5F\"/><path d=\"M62 59 C64 63 68 62 69 57 Z\" fill=\"#5F5F5F\" opacity=\".7\"/><path d=\"M63 53.5 L69 53\" stroke=\"#8A4B3B\" stroke-width=\"2\" stroke-linecap=\"round\"/><ellipse cx=\"44\" cy=\"39\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M33 29 L71 28 C72 35 70 38 66 38 C61 38 58 36 55 37 L33 36 Z\" fill=\"#111\"/><path d=\"M33 31 l-9 -4 l2 6 l-3 5 l10 -3 Z\" fill=\"#111\"/><ellipse cx=\"63\" cy=\"33\" rx=\"4.6\" ry=\"3.4\" fill=\"#fff\"/><circle cx=\"65\" cy=\"33.2\" r=\"2.3\" fill=\"#3B2A20\"/><path d=\"M57 24 Q63 21 69 24\" stroke=\"#5E5E5E\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 35 C29 16 38 4 50 3 C58 1 68 5 70 14 C71 19 69 21 66 19 C58 15 48 16 42 20 C39 26 38 30 36 35 Z\" fill=\"#8C8C8C\"/><path d=\"M42 9 q5 -4 11 -3 M55 7 q6 -1 10 3 M36 20 q2 -6 7 -8\" stroke=\"#C9C9C9\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></svg>" },
      { nombre: "rayoman-vuela", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"190\" height=\"96\" viewBox=\"0 0 190 96\"><g stroke=\"#9FC3FF\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M4 32h22M10 52h18M2 72h24\"/></g><path d=\"M104 40 C82 26 56 20 30 24 C40 32 34 38 26 42 C42 46 38 52 30 58 C56 62 84 60 104 54 Z\" fill=\"#1E2A5A\"/><path d=\"M104 40 C84 34 62 32 42 34\" stroke=\"#2C3B78\" stroke-width=\"3\" fill=\"none\"/><path d=\"M88 52 L50 56\" stroke=\"#2E3B59\" stroke-width=\"12\" stroke-linecap=\"round\"/><path d=\"M88 60 L52 68\" stroke=\"#3A4A6E\" stroke-width=\"12\" stroke-linecap=\"round\"/><ellipse cx=\"44\" cy=\"56\" rx=\"5\" ry=\"9\" fill=\"#22272E\"/><ellipse cx=\"46\" cy=\"69\" rx=\"5\" ry=\"9\" fill=\"#22272E\"/><path d=\"M112 60 L96 70\" stroke=\"#D9A585\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M84 44 Q82 56 84 68 L128 66 Q132 56 128 46 Z\" fill=\"#16181D\"/><g transform=\"translate(100 46) scale(0.15)\"><path d=\"M52 4 L18 62 L42 62 L30 112 L80 44 L54 44 L70 4 Z\" fill=\"#FFC93C\" stroke=\"#E08A00\" stroke-width=\"6\" stroke-linejoin=\"round\"/><circle cx=\"40\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"56\" cy=\"40\" r=\"7\" fill=\"#fff\"/><circle cx=\"41.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><circle cx=\"57.5\" cy=\"41\" r=\"4\" fill=\"#1B2140\"/><path d=\"M40 55 Q49 63 58 54\" fill=\"none\" stroke=\"#1B2140\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><g transform=\"translate(146 36) rotate(-10) scale(.8) translate(-50 -38)\"><path d=\"M33 32 C32 8 68 6 69 30 L71 36 L77 43 L71 46 L70 52 C66 65 48 67 40 60 C34 54 32 44 33 32 Z\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/><path d=\"M38 44 C42 56 48 65 56 65 C64 64 69 58 70 51 L69 49 C64 50 59 48 56 47 C50 48 44 46 38 44 Z\" fill=\"#A3A3A3\"/><path d=\"M61 49 C65 47 69 48 70 50 C66 50 63 51 61 49 Z\" fill=\"#5F5F5F\"/><path d=\"M62 59 C64 63 68 62 69 57 Z\" fill=\"#5F5F5F\" opacity=\".7\"/><path d=\"M63 53.5 L69 53\" stroke=\"#8A4B3B\" stroke-width=\"2\" stroke-linecap=\"round\"/><ellipse cx=\"44\" cy=\"39\" rx=\"4.5\" ry=\"7\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.5\"/><path d=\"M33 29 L71 28 C72 35 70 38 66 38 C61 38 58 36 55 37 L33 36 Z\" fill=\"#111\"/><path d=\"M33 31 l-9 -4 l2 6 l-3 5 l10 -3 Z\" fill=\"#111\"/><ellipse cx=\"63\" cy=\"33\" rx=\"4.6\" ry=\"3.4\" fill=\"#fff\"/><circle cx=\"65\" cy=\"33.2\" r=\"2.3\" fill=\"#3B2A20\"/><path d=\"M57 24 Q63 21 69 24\" stroke=\"#5E5E5E\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M33 35 C29 16 38 4 50 3 C58 1 68 5 70 14 C71 19 69 21 66 19 C58 15 48 16 42 20 C39 26 38 30 36 35 Z\" fill=\"#8C8C8C\"/><path d=\"M42 9 q5 -4 11 -3 M55 7 q6 -1 10 3 M36 20 q2 -6 7 -8\" stroke=\"#C9C9C9\" stroke-width=\"2\" fill=\"none\" stroke-linecap=\"round\"/></g><path d=\"M124 52 C140 54 158 54 174 52\" stroke=\"#F2C6A5\" stroke-width=\"8.5\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M122 47 L134 49 L133 58 L122 58 Z\" fill=\"#16181D\"/><circle cx=\"178\" cy=\"51.5\" r=\"6.5\" fill=\"#F2C6A5\" stroke=\"#D9A585\" stroke-width=\"1.2\"/></svg>" }
    ] },
    { nombre: 'Robot', disfraces: [
      { nombre: 'robot-a', svg: svg(92, 110,
        '<line x1="46" y1="6" x2="46" y2="20" stroke="#5B6280" stroke-width="4"/><circle cx="46" cy="6" r="5" fill="#FF6B4A"/>' +
        '<rect x="18" y="20" width="56" height="42" rx="12" fill="#B9C6E4" stroke="#5B6280" stroke-width="4"/>' +
        '<rect x="26" y="30" width="40" height="18" rx="8" fill="#1E2A5A"/><circle cx="38" cy="39" r="5" fill="#5CE1E6"/><circle cx="56" cy="39" r="5" fill="#5CE1E6"/>' +
        '<rect x="24" y="66" width="44" height="32" rx="8" fill="#8EA0CF" stroke="#5B6280" stroke-width="4"/><circle cx="46" cy="82" r="6" fill="#FFC93C"/>' +
        '<rect x="8" y="68" width="12" height="26" rx="6" fill="#B9C6E4" stroke="#5B6280" stroke-width="3"/><rect x="72" y="68" width="12" height="26" rx="6" fill="#B9C6E4" stroke="#5B6280" stroke-width="3"/>' +
        '<rect x="30" y="98" width="10" height="10" rx="3" fill="#5B6280"/><rect x="52" y="98" width="10" height="10" rx="3" fill="#5B6280"/>') },
      { nombre: 'robot-b', svg: svg(92, 110,
        '<line x1="46" y1="6" x2="46" y2="20" stroke="#5B6280" stroke-width="4"/><circle cx="46" cy="6" r="5" fill="#22A06B"/>' +
        '<rect x="18" y="20" width="56" height="42" rx="12" fill="#B9C6E4" stroke="#5B6280" stroke-width="4"/>' +
        '<rect x="26" y="30" width="40" height="18" rx="8" fill="#1E2A5A"/><path d="M33 41 q5 -6 10 0 M51 41 q5 -6 10 0" stroke="#5CE1E6" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<rect x="24" y="66" width="44" height="32" rx="8" fill="#8EA0CF" stroke="#5B6280" stroke-width="4"/><circle cx="46" cy="82" r="6" fill="#22A06B"/>' +
        '<rect x="8" y="46" width="12" height="26" rx="6" fill="#B9C6E4" stroke="#5B6280" stroke-width="3" transform="rotate(-25 14 70)"/><rect x="72" y="68" width="12" height="26" rx="6" fill="#B9C6E4" stroke="#5B6280" stroke-width="3"/>' +
        '<rect x="30" y="98" width="10" height="10" rx="3" fill="#5B6280"/><rect x="52" y="98" width="10" height="10" rx="3" fill="#5B6280"/>') }
    ] },
    { nombre: 'Pelota', disfraces: [
      { nombre: 'pelota', svg: svg(56, 56,
        '<circle cx="28" cy="28" r="25" fill="#FF6B4A" stroke="#B53A22" stroke-width="3"/>' +
        '<path d="M5 24 Q28 34 51 24 M5 32 Q28 42 51 32" stroke="#FFF2C6" stroke-width="4" fill="none"/><circle cx="19" cy="15" r="5" fill="#fff" opacity=".55"/>') }
    ] },
    { nombre: 'Coche', disfraces: [
      { nombre: 'coche', svg: svg(120, 62,
        '<path d="M8 40 Q8 28 20 26 L38 24 L52 10 Q56 6 62 6 L84 6 Q92 6 96 12 L104 24 Q114 26 114 38 L114 44 Q114 48 110 48 L12 48 Q8 48 8 44 Z" fill="#1E88E5" stroke="#0D47A1" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M56 12 L60 9 L72 9 L72 24 L44 24 Z M77 9 L86 9 Q90 9 92 13 L98 24 L77 24 Z" fill="#BBDEFB"/>' +
        '<circle cx="32" cy="48" r="11" fill="#263238"/><circle cx="32" cy="48" r="4.5" fill="#CFD8DC"/><circle cx="92" cy="48" r="11" fill="#263238"/><circle cx="92" cy="48" r="4.5" fill="#CFD8DC"/>' +
        '<rect x="108" y="31" width="7" height="6" rx="2" fill="#FFF59D"/>') }
    ] },
    { nombre: 'Pez', disfraces: [
      { nombre: 'pez-a', svg: svg(100, 66,
        '<path d="M22 33 L4 14 L8 33 L4 52 Z" fill="#FFA726" stroke="#E65100" stroke-width="3" stroke-linejoin="round"/>' +
        '<ellipse cx="56" cy="33" rx="38" ry="24" fill="#FFB74D" stroke="#E65100" stroke-width="3"/>' +
        '<path d="M48 10 Q58 2 68 11" fill="#FFA726" stroke="#E65100" stroke-width="3"/><circle cx="74" cy="28" r="6" fill="#fff"/><circle cx="76" cy="28" r="3" fill="#1B2140"/>' +
        '<path d="M86 38 q-4 4 -8 2" stroke="#E65100" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M42 24 q6 9 0 18 M52 22 q6 11 0 22" stroke="#E65100" stroke-width="2" fill="none" opacity=".6"/>') },
      { nombre: 'pez-b', svg: svg(100, 66,
        '<path d="M22 33 L2 22 L10 33 L2 44 Z" fill="#FFA726" stroke="#E65100" stroke-width="3" stroke-linejoin="round"/>' +
        '<ellipse cx="56" cy="33" rx="38" ry="24" fill="#FFB74D" stroke="#E65100" stroke-width="3"/>' +
        '<path d="M48 10 Q58 4 68 11" fill="#FFA726" stroke="#E65100" stroke-width="3"/><circle cx="74" cy="28" r="6" fill="#fff"/><circle cx="76" cy="28" r="3" fill="#1B2140"/>' +
        '<circle cx="90" cy="38" r="3" fill="none" stroke="#E65100" stroke-width="2"/><path d="M42 24 q6 9 0 18 M52 22 q6 11 0 22" stroke="#E65100" stroke-width="2" fill="none" opacity=".6"/>') }
    ] },
    { nombre: 'Estrella', disfraces: [
      { nombre: 'estrella', svg: svg(70, 68,
        '<path d="M35 4 L44 25 L67 26 L49 41 L55 64 L35 51 L15 64 L21 41 L3 26 L26 25 Z" fill="#FFD54F" stroke="#F9A825" stroke-width="4" stroke-linejoin="round"/>' +
        ojos(28, 42, 34, 3.5)) }
    ] },
    { nombre: 'Flecha', disfraces: [
      { nombre: 'flecha', svg: svg(90, 50, '<path d="M4 18 L56 18 L56 4 L86 25 L56 46 L56 32 L4 32 Z" fill="#7E57C2" stroke="#4527A0" stroke-width="3" stroke-linejoin="round"/>') }
    ] },
    { nombre: 'Cohete', disfraces: [
      { nombre: 'cohete', svg: svg(110, 56,
        '<path d="M14 28 L2 14 L26 18 Z M14 28 L2 42 L26 38 Z" fill="#E53935"/>' +
        '<path d="M16 16 L76 16 Q100 18 106 28 Q100 38 76 40 L16 40 Z" fill="#ECEFF1" stroke="#546E7A" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="70" cy="28" r="8" fill="#4FC3F7" stroke="#546E7A" stroke-width="3"/><path d="M16 22 L4 22 M16 34 L4 34" stroke="#FFB300" stroke-width="5" stroke-linecap="round"/>') }
    ] },
    { nombre: 'Bloque', disfraces: [
      { nombre: 'bloque', svg: svg(60, 60, '<rect x="4" y="4" width="52" height="52" rx="8" fill="#26A69A" stroke="#00695C" stroke-width="4"/>') }
    ] }
  ];

  function cuadricula() {
    var g = '<rect width="480" height="360" fill="#fff"/>';
    for (var x = 0; x <= 480; x += 20) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="360" stroke="' + (x % 100 === 40 ? '#C5CAE9' : '#ECEFF1') + '"/>';
    for (var y = 0; y <= 360; y += 20) g += '<line x1="0" y1="' + y + '" x2="480" y2="' + y + '" stroke="' + (y % 100 === 80 ? '#C5CAE9' : '#ECEFF1') + '"/>';
    g += '<line x1="0" y1="180" x2="480" y2="180" stroke="#5B6280" stroke-width="2"/><line x1="240" y1="0" x2="240" y2="360" stroke="#5B6280" stroke-width="2"/>';
    [-200, -100, 100, 200].forEach(function (v) {
      g += '<text x="' + (240 + v) + '" y="196" font-family="sans-serif" font-size="11" fill="#5B6280" text-anchor="middle">' + v + '</text>';
    });
    [-100, 100].forEach(function (v) {
      g += '<text x="246" y="' + (184 - v) + '" font-family="sans-serif" font-size="11" fill="#5B6280">' + v + '</text>';
    });
    g += '<text x="470" y="172" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1E2A5A" text-anchor="end">x</text><text x="248" y="16" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1E2A5A">y</text>';
    return g;
  }
  function estrellas() {
    var s = '', semilla = 7;
    var azar = function () { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
    for (var i = 0; i < 90; i++) s += '<circle cx="' + (azar() * 480).toFixed(0) + '" cy="' + (azar() * 360).toFixed(0) + '" r="' + (azar() * 1.6 + .4).toFixed(1) + '" fill="#fff" opacity="' + (azar() * .6 + .4).toFixed(2) + '"/>';
    return s;
  }

  var FONDOS = [
    { nombre: 'Blanco', svg: svg(480, 360, '<rect width="480" height="360" fill="#fff"/>') },
    { nombre: 'Cuadrícula XY', svg: svg(480, 360, cuadricula()) },
    { nombre: 'Cielo', svg: svg(480, 360, '<defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#64B5F6"/><stop offset="1" stop-color="#E3F2FD"/></linearGradient></defs><rect width="480" height="360" fill="url(#c)"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="90" cy="70" rx="46" ry="18"/><ellipse cx="120" cy="58" rx="30" ry="20"/><ellipse cx="360" cy="110" rx="52" ry="18"/><ellipse cx="390" cy="96" rx="30" ry="18"/></g><circle cx="420" cy="50" r="24" fill="#FFD54F"/>') },
    { nombre: 'Campo', svg: svg(480, 360, '<rect width="480" height="360" fill="#B3E5FC"/><path d="M0 230 Q120 190 240 222 T480 210 L480 360 L0 360 Z" fill="#81C784"/><path d="M0 270 Q160 240 300 268 T480 262 L480 360 L0 360 Z" fill="#66BB6A"/><circle cx="70" cy="60" r="26" fill="#FFEB3B"/>') },
    { nombre: 'Mar', svg: svg(480, 360, '<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FC3F7"/><stop offset="1" stop-color="#01579B"/></linearGradient></defs><rect width="480" height="360" fill="url(#m)"/>' +
      '<path d="M0 330 Q60 310 120 330 T240 330 T360 330 T480 330 L480 360 L0 360Z" fill="#FFE082"/><g fill="none" stroke="#fff" opacity=".5" stroke-width="2"><circle cx="60" cy="120" r="5"/><circle cx="72" cy="96" r="3"/><circle cx="400" cy="200" r="6"/><circle cx="412" cy="176" r="3"/></g>' +
      '<path d="M40 330 q-6 -40 6 -70 M52 330 q8 -30 -2 -60 M430 332 q-8 -36 4 -64" stroke="#2E7D32" stroke-width="6" fill="none" stroke-linecap="round"/>') },
    { nombre: 'Espacio', svg: svg(480, 360, '<rect width="480" height="360" fill="#0D1033"/>' + estrellas() + '<circle cx="400" cy="290" r="50" fill="#7E57C2"/><ellipse cx="400" cy="290" rx="78" ry="14" fill="none" stroke="#B39DDB" stroke-width="5"/>') },
    { nombre: 'Pizarra', svg: svg(480, 360, '<rect width="480" height="360" fill="#6D4C41"/><rect x="12" y="12" width="456" height="336" fill="#2E5E4E"/>') },
    { nombre: 'Laberinto', svg: svg(480, 360, '<rect width="480" height="360" fill="#FFF8EE"/><g fill="#1E2A5A">' +
      '<rect x="0" y="0" width="480" height="12"/><rect x="0" y="348" width="480" height="12"/><rect x="0" y="0" width="12" height="360"/><rect x="468" y="0" width="12" height="360"/>' +
      '<rect x="90" y="0" width="12" height="250"/><rect x="190" y="110" width="12" height="250"/><rect x="290" y="0" width="12" height="250"/><rect x="390" y="110" width="12" height="250"/></g>' +
      '<rect x="414" y="300" width="48" height="42" fill="#22A06B"/><text x="438" y="327" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff" text-anchor="middle">META</text>') }
  ];

  // Sonidos sintetizados: [nombre, tipo]. motor.js sabe cómo tocar cada tipo.
  var SONIDOS = [
    { nombre: 'Pop', tipo: 'pop', dur: 0.15 },
    { nombre: 'Campana', tipo: 'campana', dur: 1.2 },
    { nombre: 'Tambor', tipo: 'tambor', dur: 0.4 },
    { nombre: 'Láser', tipo: 'laser', dur: 0.35 },
    { nombre: 'Moneda', tipo: 'moneda', dur: 0.35 },
    { nombre: 'Salto', tipo: 'salto', dur: 0.3 },
    { nombre: 'Aplausos', tipo: 'aplausos', dur: 1.4 },
    { nombre: 'Fanfarria', tipo: 'fanfarria', dur: 1.1 }
  ];

  window.RBBiblioteca = { OBJETOS: OBJETOS, FONDOS: FONDOS, SONIDOS: SONIDOS };
})();

<?php

# Регистрируем главное приложение
$app 			= new Silex\Application();
$app['debug'] 	= true;

# Регистрируем шаблонизатор twig
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

# Регистрируем сессию
$app->register(new Silex\Provider\SessionServiceProvider());

$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {
    $twig->addFunction(new \Twig_SimpleFunction('asset', function ($asset) {
        // implement whatever logic you need to determine the asset path
        return sprintf('http://'.$_SERVER['SERVER_NAME'].'/%s', ltrim($asset, '/'));
    }));
    return $twig;
}));

# Регестрируем генератор url-ов
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

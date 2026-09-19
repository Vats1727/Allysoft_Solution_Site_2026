<?php

require_once __DIR__ . '/../controllers/GenericController.php';

$tables = [
    'navbar_section',
    'hero_section',
    'services_settings',
    'services',
    'work_settings',
    'projects',
    'stack_settings',
    'stack',
    'why_ally_section',
    'why_ally_points',
    'how_we_work_settings',
    'how_we_work_steps',
    'why_choose_us_settings',
    'why_choose_us',
    'about_section',
    'about_bullets',
    'team_settings',
    'team',
    'contact_section',
    'contact_info',
    'footer_section',
    'submissions',
    'users'
];

foreach ($tables as $tbl) {
    $ctrl = new GenericController($tbl);
    
    $router->get("/api/$tbl/active", [$ctrl, 'getActive']);
    $router->get("/api/admin/$tbl", [$ctrl, 'getAll']);
    $router->get("/api/admin/$tbl/{id}", [$ctrl, 'getById']);
    $router->post("/api/admin/$tbl", [$ctrl, 'create']);
    $router->put("/api/admin/$tbl/{id}", [$ctrl, 'update']);
    $router->delete("/api/admin/$tbl/{id}", [$ctrl, 'delete']);
}

// Public Lead Submissions route
$router->post("/api/submissions", [(new GenericController('submissions')), 'create']);

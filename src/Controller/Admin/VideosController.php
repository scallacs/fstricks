<?php
namespace App\Controller\Admin;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * Videos Controller
 *
 * @property \App\Model\Table\VideosTable $Videos
 */
class VideosController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index() {
        $this->Videos->updateVideoDuration();
    }

    
}

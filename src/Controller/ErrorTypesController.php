<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * ErrorTypes Controller
 *
 * @property \App\Model\Table\ErrorTypesTable $ErrorTypes
 */
class ErrorTypesController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index(){
        $query = $this->ErrorTypes->find('all');
        ResultMessage::overwriteData($query->all());
        ResultMessage::setSuccess(true);
    }

}

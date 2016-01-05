<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Lib\ResultMessage;
/**
 * ReportErrors Controller
 *
 * @property \App\Model\Table\ReportErrorsTable $ReportErrors
 */
class ReportErrorsController extends AppController
{

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $reportError = $this->ReportErrors->newEntity();
        if ($this->request->is('post')) {
            $reportError = $this->ReportErrors->patchEntity($reportError, $this->request->data);
            if ($this->ReportErrors->save($reportError)) {
                ResultMessage::setMessage(__('The report error has been saved.'), true);
            } else {
                ResultMessage::setMessage(__('The report error could not be saved. Please, try again.'), false);
            }
        }
    }

}

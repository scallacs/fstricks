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
    public function add() {
        $reportError = $this->ReportErrors->newEntity();
        if ($this->request->is('post')) {
            $reportError = $this->ReportErrors->patchEntity($reportError, $this->request->data);
            $reportError->user_id = $this->Auth->user('id');
            $reportError->error_type_id = 4; // OTHER
            
            // TODO limit the number of report per day. 
            
            if ($this->ReportErrors->save($reportError)) {
                ResultMessage::setMessage(__('The report error has been sent. Thanks for your help!'), true);
            } else {
                ResultMessage::setMessage(__('The report error could not be saved. Please, check your inputs and try again.'), false);
                ResultMessage::setValidationErrors($this->ReportErrors);
            }
        }
    }

    /**
     * 
     */
    public function index() {
        $query = $this->ReportErrors
                ->find('all')
                ->cache('report_errors', 'veryLongCache');
        ResultMessage::overwriteData($query-all());
        ResultMessage::setSuccess(true);
    }
}

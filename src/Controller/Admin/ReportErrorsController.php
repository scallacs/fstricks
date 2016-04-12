<?php
namespace App\Controller\Admin;

use App\Lib\ResultMessage;
use App\Model\Entity\ReportError;
/**
 * ReportErrors Controller
 *
 * @property \App\Model\Table\ReportErrorsTable $ReportErrors
 */
class ReportErrorsController extends AppController
{

    public function initialize() {
        parent::initialize();
        $this->loadComponent('Paginator');
    }
    
    public function index() {
        $query = $this->ReportErrors->find('all')
                ->select([
                    'count_ref' => 'COUNT(ReportErrors.video_tag_id)'
                ])
                ->order(['ReportErrors.created DESC'])
                ->where(['ReportErrors.status IN' => [ReportError::STATUS_PENDING]])
                ->group(['ReportErrors.video_tag_id'])
                ->contain(['VideoTags']);
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Report Error id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $reportError = $this->ReportErrors->get($id, [
            'contain' => ['Users', 'ErrorTypes', 'VideoTags']
        ]);
        ResultMessage::overwriteData($reportError->first());
        ResultMessage::setWrapper(false);
    }

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
                $this->Flash->success(__('The report error has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The report error could not be saved. Please, try again.'));
            }
        }
        $users = $this->ReportErrors->Users->find('list', ['limit' => 200]);
        $errorTypes = $this->ReportErrors->ErrorTypes->find('list', ['limit' => 200]);
        $videoTags = $this->ReportErrors->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('reportError', 'users', 'errorTypes', 'videoTags'));
        $this->set('_serialize', ['reportError']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Report Error id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $reportError = $this->ReportErrors->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $reportError = $this->ReportErrors->patchEntity($reportError, $this->request->data);
            if ($this->ReportErrors->save($reportError)) {
                $this->Flash->success(__('The report error has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The report error could not be saved. Please, try again.'));
            }
        }
        $users = $this->ReportErrors->Users->find('list', ['limit' => 200]);
        $errorTypes = $this->ReportErrors->ErrorTypes->find('list', ['limit' => 200]);
        $videoTags = $this->ReportErrors->VideoTags->find('list', ['limit' => 200]);
        $this->set(compact('reportError', 'users', 'errorTypes', 'videoTags'));
        $this->set('_serialize', ['reportError']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Report Error id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $reportError = $this->ReportErrors->get($id);
        if ($this->ReportErrors->delete($reportError)) {
            $this->Flash->success(__('The report error has been deleted.'));
        } else {
            $this->Flash->error(__('The report error could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}

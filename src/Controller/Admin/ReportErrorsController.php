<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * ReportErrors Controller
 *
 * @property \App\Model\Table\ReportErrorsTable $ReportErrors
 */
class ReportErrorsController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $this->paginate = [
            'contain' => ['Users', 'ErrorTypes', 'VideoTags']
        ];
        $this->set('reportErrors', $this->paginate($this->ReportErrors));
        $this->set('_serialize', ['reportErrors']);
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
        $this->set('reportError', $reportError);
        $this->set('_serialize', ['reportError']);
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

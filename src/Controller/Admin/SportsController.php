<?php
namespace App\Controller\Admin;

use App\Lib\ResultMessage;
/**
 * Sports Controller
 *
 * @property \App\Model\Table\SportsTable $Sports
 */
class SportsController extends AppController
{

    /**
     * Index method
     *
     * @return void
     */
    public function index()
    {
        $query = $this->Sports->find('all');
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($this->paginate($query));
    }

    /**
     * View method
     *
     * @param string|null $id Sport id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $sport = $this->Sports->get($id, [
            'contain' => ['Categories']
        ]);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($sport);
    }

    /**
     * Add method
     *
     * @return void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $sport = $this->Sports->newEntity();
        if ($this->request->is('post')) {
            $sport = $this->Sports->patchEntity($sport, $this->request->data);
            if ($this->Sports->save($sport)) {
                $this->Flash->success(__('The sport has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The sport could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('sport'));
        $this->set('_serialize', ['sport']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Sport id.
     * @return void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $sport = $this->Sports->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $sport = $this->Sports->patchEntity($sport, $this->request->data);
            if ($this->Sports->save($sport)) {
                $this->Flash->success(__('The sport has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The sport could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('sport'));
        $this->set('_serialize', ['sport']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Sport id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $sport = $this->Sports->get($id);
        if ($this->Sports->delete($sport)) {
            $this->Flash->success(__('The sport has been deleted.'));
        } else {
            $this->Flash->error(__('The sport could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}

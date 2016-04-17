<?php
namespace App\Controller\Admin;

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
    public function index()
    {
        $this->Videos->initFilters('admin');
//        $this->Paginator->config(Configure::read('Pagination.Users'));
        $query = $this->Videos->find('search', $this->Videos->filterParams($this->request->query));
        ResultMessage::paginate($query, $this);
    }

    /**
     * View method
     *
     * @param string|null $id Rider id.
     * @return void
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function view($id = null)
    {
        $video = $this->Videos->get($id, [
            'contain' => ['Users']
        ]);
        ResultMessage::setWrapper(false);
        ResultMessage::overwriteData($video);
    }
}

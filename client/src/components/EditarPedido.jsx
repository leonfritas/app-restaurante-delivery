import { useState, useEffect, useContext } from 'react';
import {LoginContext} from '../context/LoginContext.jsx'
import Axios from "axios"
import ListaProdutos from './ListaProdutos.jsx';
import './css/homeNovoPedido.css'
import { mensagem } from '../geral.jsx';
import { useNavigate } from "react-router-dom";
import './css/ApagarDepois.css'
import Loading from './Loading.jsx';


export default function EditarPedido(){
    const [listProdutoEditar, setListProdutoEditar] = useState();      
    const { idGrupoPedido, nomeGrupoPedido, setNomeGrupoPedido} = useContext(LoginContext); 
    const navigate = useNavigate(); 
    const [quantidades, setQuantidades] = useState({});
    const [removeLoading, setRemoveLoading] = useState(false);    



    function atualizaEdicao(){
        Axios.post("http://localhost:3001/orderGroup/orderGroupEdit",{
            idGrupoPedido: idGrupoPedido
          }        
          ).then((response) => {
            const produtos = response.data[0];
            setListProdutoEditar(produtos);
            const quantidadesIniciais = {};
            produtos.forEach(produto => {
                quantidadesIniciais[produto.idProduto] = produto.quantidade;
            });
            setQuantidades(quantidadesIniciais);        
          })
          setRemoveLoading(true)
    }
    useEffect(() => {
        atualizaEdicao();
           
      }, []);


    function pedidoInserir(idProduto, preco, quantidade){         
        if (idGrupoPedido > 0){
            const novaQuantidade = (quantidades[idProduto] || 0) + 1;
            Axios.post("http://localhost:3001/requested/requestInsert", {                
                idGrupoPedido: idGrupoPedido,
                idProduto: idProduto,   
                quantidade: quantidade,             
                preco: preco,            
            }).then(() => {                                               
                setQuantidades(prev => ({
                    ...prev,
                    [idProduto]: novaQuantidade
                }));                                     
            })  
            atualizaEdicao();          
        }else{
            mensagem('Informe o código do pedido.')
        }        
    }

    function pedidoExcluir(idProduto){         
        if (idGrupoPedido > 0){
            const novaQuantidade = (quantidades[idProduto] || 0) - 1;            
            if (novaQuantidade >= 0) {
                Axios.post("http://localhost:3001/requested/requestDelete", {                
                    idGrupoPedido: idGrupoPedido,
                    idProduto: idProduto         
                }).then(() => {                                              
                    setQuantidades(prev => ({
                        ...prev,
                        [idProduto]: novaQuantidade
                    }));                                       
                })
            }    
            atualizaEdicao(); 
        }else{
            mensagem('Informe o código do pedido.')
        }        
    }

    function salvarGrupoPedido(){                         
        if (idGrupoPedido > 0){
            Axios.post("http://localhost:3001/orderGroup/orderGroupSave", {                
                idGrupoPedido: idGrupoPedido,
                nomeGrupoPedido: nomeGrupoPedido          
            }).then(() => {                                                                                  
            })
            mensagem('Pedido salvo com sucesso.')
            navigate('/home')
        }else{
            mensagem('Informe o código do pedido.')
        }  
    }

    function cancelarGrupoPedido(){                    
            navigate('/home')       
    }


    return(
        <div className='NovoPedidoContainer'>
            <h2>Editar pedido</h2>
            <div className='botoesPedido'>                
                <button className='apagarDepois' onClick={() => salvarGrupoPedido()}>Salvar Pedido</button>             
                <button className='apagarDepois' onClick={() => cancelarGrupoPedido()}>Cancelar Pedido</button>                                              
            </div>      

            <input className='inputNomeGrupoPedido' placeholder='Digite aqui o nome do pedido' type="text" value={nomeGrupoPedido} onChange={(e) => setNomeGrupoPedido(e.target.value)}/>   
            {/* <input  className='inputNomeGrupoPedido' value={nomeGrupoPedido} type="text" />  */}
            <h2>Selecione os items do pedido:</h2>
            <div >                    
                <ul className='NovoPedidoContainerLista'>
                    <li>Item</li>
                    <li>Valor</li>
                    <li>categoria</li> 
                    <li>preco</li>
                </ul>
                <div >                      
                    {listProdutoEditar?.map((value) => (
                                <div key={value.idProduto} className='listaProdutos'>
                                   <ListaProdutos  
                                    listCard={listProdutoEditar}
                                    setListCard={setListProdutoEditar}
                                    id={value.idProduto}
                                    name={value.nomeProduto}
                                    cost={value.preco}
                                    category={value.nomeCategoria}
                                    quantidade={quantidades[value.idProduto] || 0} /> 
                                    <div className='adicionaERemoveProduto'>
                                        <button className='buttonApagarDepois' onClick={() => pedidoInserir(value.idProduto, value.preco, value.quantidade)}>+</button>                                                                                                          
                                            <p>{quantidades[value.idProduto] || 0}</p>
                                        <button className='buttonApagarDepois' onClick={() => pedidoExcluir(value.idProduto)}>-</button>
                                    </div>    
                                </div>
                            ))}
                            {!removeLoading && <Loading />}  
                </div>               
            </div>

        </div>
    )
}
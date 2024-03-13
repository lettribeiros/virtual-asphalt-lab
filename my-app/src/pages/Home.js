import React from 'react';
import { Link } from 'react-router-dom';
import NavMenu from '../components/NavMenu'
import '../styles/Home.css'

function Home() {
    return (
        <div className="containerHome">
            <header>
                    <div id='cabecalho'>
                        <div>
                        <h1>Virtual Asphalt Lab</h1>
                        {/* <p>Seu laboratório virtual para misturas asfálticas</p> */}
                        </div>
                        <div>
                            <NavMenu/>
                        </div>
                    </div>
                </header>
        <div className='containerConteudo' id='inicio'>
            <div className='conteudo'>
                <div className='intro'>
                    <div id='texto1'>
                        <h4>BEM VINDO(A)</h4>
                        <p id='p1'>APROVEITE A NOSSA TECNOLOGIA</p>
                        <h3>SERVIÇOS DE ANÁLISE E DESENVOLVIMENTO CONFIÁVEIS E ESPECIALIZADOS</h3>
                        <h5>DEIXE-NOS FACILITAR E AGILIZAR O DESAFIO DAS MISTURAS</h5>
                        <p>Nosso laboratório oferece aos nossos clientes soluções avançadas para análise e desenvolvimento de misturas asfálticas, com acesso fácil e a preços acessíveis. Estamos aqui para auxiliar em projetos de pavimentação, pesquisas de materiais e otimização de fórmulas. Com uma equipe de especialistas altamente capacitados, garantimos que atenderemos às suas demandas específicas, oferecendo resultados precisos e confiáveis.
                        Não importa o tamanho do seu projeto ou a complexidade da sua necessidade, estamos prontos para oferecer soluções sob medida que atendam aos mais altos padrões de qualidade. Confie em nossa experiência e conhecimento para impulsionar o sucesso dos seus empreendimentos. Então, não perca mais tempo e recursos. Conte conosco para garantir a excelência em suas misturas asfálticas!</p>
                    </div>
                </div>
                <div id='descricao'>
                    <section>
                        <h2>Leia-me antes de usar</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                    </section>
                </div>
                <div id='lab' className='lab'>
                <div id='texto2'>
                    <h2>Laboratório</h2>
                    <div className="button-container">
                        <Link to='/lab-composicao-desempenho'  className="button">Constituição &rarr; Desempenho Mecânico</Link>
                        <Link to='/lab-desempenho-composicao'  className="button">Desempenho Mecânico &rarr; Constituição</Link>
                    </div>
                </div>
                </div>
                <div id='about-us' className="about-us">
                    <h2>Sobre Nós</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                </div>
                        </div>
                
            </div>
            <footer>
                <p>&copy; 2024</p>
                </footer>
        </div>
    )
}

export default Home;
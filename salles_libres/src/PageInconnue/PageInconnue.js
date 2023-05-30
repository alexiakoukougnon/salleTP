import './PageInconnue.css'

/**
 * Quand on navique vers un lien inconnu on affiche cette erreur
 * @returns {JSX.Element}
 * @constructor
 */
function PageInconnue() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>Désolé, la page que vous cherchez n'existe pas.</p>
        </div>
    );
}

export default PageInconnue;
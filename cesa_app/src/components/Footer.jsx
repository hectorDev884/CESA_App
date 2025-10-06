import React from "react";

const Footer = () => {
    return (
        <footer className="mt-12 px-4 py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Política de Privacidad
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Términos de Servicio
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Contáctenos
                    </a>
                </div>
                <div className="text-gray-600 text-sm">
                    © 2025 C.E.S.A of N.A.E. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}

export default Footer;

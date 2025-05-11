export const welcomeMessage = (
  email: string,
  img: string,
  pass?: string,
  resetLink?: string,
) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-top: 5px solid #3498db; border-bottom: 5px solid #3498db; border-radius: 8px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <img src="${img}" alt="Logo de SafeStock" style="max-width: 50px;">
      <h1 style="margin: 0;"><strong>SafeStock</strong></h1>
    </div>

    <div>
      <img src="https://res.cloudinary.com/dtwxythux/image/upload/v1746797188/worker-checking-goods-stock-supply-600nw-2501786385_cpk36e.webp" style="width: 100%; margin: 20px 0;">
    </div>

    <div>  
      <h1 style="color: #2c3e50;">Gracias por registrarte en nuestra plataforma</h1>
      <p>Nos alegra tenerte con nosotros.</p>

      <p>
        A partir de ahora, podrás acceder a <strong>SafeStock</strong>, gestionar tu inventario, ventas y disfrutar de todas nuestras funcionalidades.
      </p>

      <p style="font-weight: bold; margin-bottom: 5px;">Tus credenciales de acceso:</p>
      <ul style="list-style-type: none; padding-left: 0;">
        <li><strong>Correo:</strong> ${email}</li>
        ${pass ? `<li><strong>Contraseña:</strong> ${pass}</li>` : ''}
      </ul>

      <p style="margin-top: 20px;">
        ¡Bienvenido/a a <strong>SafeStock</strong>! Esperamos que disfrutes de nuestros servicios.
      </p>

      <p style="margin-top: 30px;">Atentamente,</p>
      <p><strong>Equipo de Soporte</strong></p>
      <p>SafeStock</p>
      <p><a href="mailto:soporte@safestore.com" style="color: #3498db;">soporte@safestock.com</a></p>

      ${resetLink ? `
        <p style="margin-top: 20px;">¿Olvidaste tu contraseña? 
          <a href="${resetLink}" style="color: #3498db;">Haz clic aquí para restablecerla</a>.
        </p>
      ` : ''}
    </div>

    <div style="display: flex; justify-content: center;">
      <img src="https://res.cloudinary.com/dtwxythux/image/upload/e_background_removal/f_png/v1746804041/pngtree-cartoon-hand-drawn-blue-banner-illustration-png-image_1567961_o2rkqw.jpg" style="width: 200px; height: 70px;  margin: 10px 0;";>
    </div>
  </div>
`;
};

<?php
use  PHPMailer\PHPMailer\PHPMailer;
use  PHPMailer\PHPMailer\SMTP;
use  PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

if(!class_exists('Mailer')){

/**
 * Manejador de EMAILs
 */
class Mailer extends PHPMailer
{
	private $config, $debug = false;
	public $success = 0;
	public $msj = "";
	function __construct($data = [])
	{
		$conf = file_get_contents('../../config.json');
		$conf = json_decode( $conf, true );
		$this->config = $conf['mail'];

		parent::__construct(true);

		if($this->config['smtp']){
			$this->isSMTP();
		}

		if($this->debug){
			$this->SMTPDebug = SMTP::DEBUG_SERVER;
		}
		
		$this->Host = $this->config['host'];
		$this->Port = $this->config['port'];

		if($this->config['smtp']){
			$this->SMTPAuth = true;
			$this->Username = $this->config['username'];
			$this->Password = $this->config['password'];
			$this->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
		}

		$this->header($data);
		$this->isHTML(true);
		$this->body($data);
		if($this->send()){
			$this->success = 1;
		}else{
			$this->success = 0;
			$this->msj =  "Mail Error: ->". $this->ErrorInfo;
		}
	}
	private function header($d)
	{
		$this->setFrom($d['email'], $d['fullname']);
		$this->addAddress($d['to']);
		if(!empty($data['cc'])){
			$this->addCC($data['cc']);
		}
		if(!empty($data['bcc'])){
			$this->addBCC($data['bcc']);
		}
	}
	private function body($d)
	{
		$this->Subject = $d['subject'];
		$tpl = __DIR__."/tpl/".$this->config['theme']."/".$this->config['tpl'].".html";
		$body = file_get_contents($tpl);
		if($d['type'] === 'follow'){
			$body = $this->getTplFw($body,$d);
		}
		$this->msgHTML($body);
	}
	private function getTplFw($tpl, $d = [])
	{

		$data = [
			"NAME"=>$d['fullname'],
			"CONTENT"=>$d['message'],
			'SITE_TEXT_URL'=>'<a href="'.$this->url().'" style="font-family: Helvetica, arial, sans-serif; font-size: 14px; text-decoration:none; color: #333333; text-align:left; line-height: 30px;">Vistenos --&gt;</a>',
			'GENERATE'=>'<p>&copy; SNA. </p>'
		];
		foreach ($data as $key => $value) {
			$tpl = str_replace("#".$key."#", $value, $tpl);
		}
		return $tpl;
	}
	private function url(){
		$host='';
		$host = isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off' ? 'https' : 'http';
		$host .= '://'. $_SERVER['HTTP_HOST'];
		$host .= str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);

		return $host;
	}
}

}
if(!empty($_POST)){
	//var_dump($_POST);
	//SOLO PARA EL DEBUG
	$data = [];
	try {
		$m = new Mailer($_POST);
		$data['success'] = $m->success;
		$data['msj'] = $m->msj;

	} catch (Exception $e) {
		$data['success'] = 0;
		$data['msj'] = $e->getMessage();
	}
	echo json_encode($data);
}

?>

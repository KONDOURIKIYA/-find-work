<!DOCTYPE html>
<html lang="ja">

<head>
<meta chareset="UFT-8">
<title>掲示板</title>
<link rel="stylesheet" type="text/css" href="style.css">

  <div class="log">
    <img src="4eachblog_logo.jpg">
  </div>
</head>

<body>

  <?php
    mb_internal_encoding("utf8");
    $pdo = new PDO("mysql:dbname=lesson02;host=localhost;","root","");
    $stmt = $pdo->query("select * from 4each_keijiban");


  ?>

  <div class="logo"></div>
            <header>
               <ul>
                  <li>トップ</li>
                  <li>プロフィール</li>
                  <li>4eachについて</li>
                  <li>登録フォーム</li>
                  <li>問い合わせ</li>
                  <li>その他</li>
               </ul>
            </header>
            
<main>

  <div class="left">
      <h1>プログラミングに役立つ掲示板</h1>
      
      <form method="post" action="insert.php">
        <h2>入力フォーム</h2>
        <div>
          <label>ハンドルネーム</label>
          <br>
          <input type="text" class="text" size="35"name="handlename">
        </div>

        <div>
          <label>タイトル</label>
          <br>
          <input type="text" class="text" size="35"name="title">
        </div>

        <div>
          <label>コメント</label>
          <br>
          <textarea cols="70" rows="7" name="comments"></textarea>
        </div>

        <div>
          <input type="submit" value="送信する">
        </div>
      </form>

        <?php
         while($row=$stmt->fetch()){

              echo"<div class='kiji'>";
                echo"<h3>".$row['title']."</h3>";
                echo"<div class='contents'>";
                   echo $row['comments'];
                   echo"<div class='handlename'>posted by".$row['handlename']."</div>";
                echo"</div>";
            echo"</div>";
         }
        ?>
      
  </div>
          

  <div class="right">
   <h3>人気の記事</h3>
   <ul>
      <li>PHPのオススメ本</li>
      <li>PHP MyAdminの使い方</li>
      <li>今話題のエディタ Top5</li>
      <li>HTMLの基礎</li>
   </ul>

   <h3>オススメリンク</h3>
   <ul>
      <li>インターノウス株式会社</li>
      <li>XPMMPのダウンロード</li>
      <li>Eclipseのダウンロード</li>
      <li>Bracketsのダウンロード</li>
   </ul>

   <h3>カテゴリ</h3>
   <ul>
      <li>HTML</li>
      <li>PHP</li>
      <li>MySQL</li>
      <li>JavaScript</li>
   </ul>            

  </div>

</main>
                <footer>
                  copyright © intrnous | 4each blog the which provides A to Z about programming
                </footer>          
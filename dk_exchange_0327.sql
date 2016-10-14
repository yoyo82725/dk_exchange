-- phpMyAdmin SQL Dump
-- version 3.5.0-rc1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2012 年 03 月 27 日 22:56
-- 服务器版本: 5.5.21
-- PHP 版本: 5.4.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `dk_exchange`
--

-- --------------------------------------------------------

--
-- 表的结构 `calll`
--

CREATE TABLE IF NOT EXISTS `calll` (
  `no` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `main` varchar(60) NOT NULL,
  `things` varchar(255) NOT NULL,
  `_check` varchar(20) NOT NULL,
  `_ip` varchar(60) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `calll`
--

INSERT INTO `calll` (`no`, `id`, `main`, `things`, `_check`, `_ip`, `date`) VALUES
(1, '蘇少瑜', '測試', '測試\r\n測試', 'maria', '120.102.152.157', '2012-03-27 14:53:51');

-- --------------------------------------------------------

--
-- 表的结构 `upload`
--

CREATE TABLE IF NOT EXISTS `upload` (
  `no` smallint(6) NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `dsc` varchar(30) NOT NULL,
  `file` varchar(255) NOT NULL,
  `ex` varchar(255) NOT NULL DEFAULT '無',
  `level` varchar(10) NOT NULL DEFAULT 'off',
  `_check` varchar(5) NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`),
  UNIQUE KEY `dsc` (`dsc`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `no` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `_check` varchar(20) NOT NULL DEFAULT 'no',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`no`, `id`, `password`, `_check`, `date`) VALUES
(1, '張家維', 'c56495b0713f22cad11f0853ec9cbc61', 'ad', '2012-03-26 17:18:45'),
(2, '胡又壬', '6436bd872c20854abe0a1c18d6df7abf', 'ad', '2012-03-26 17:01:55'),
(3, '藍于婷', '55042c01697053af46b0231ef021e100', 'ad', '2012-03-26 17:02:10'),
(4, '鄭曲雅', '27479e1ff5f059138625223f3f51f4de', 'ad', '2012-03-26 17:10:48'),
(5, '練佳威', 'de088d6424e609fc481e6d50db544d0f', 'john', '2012-03-27 13:00:59'),
(6, '吳家熙', '6d149389d079b0a35d3b3d82288977a9', 'john', '2012-03-27 12:41:49'),
(7, '張韋凡', '3df91d52e2bd5835ef59a9bb7c982e85', 'john', '2012-03-27 12:41:49'),
(8, '陳威棣', '28f1288ab7faa8dde861bf944e6a2af5', 'john', '2012-03-27 13:01:03'),
(9, '林品逸', '63fd7322a934a7c0d77ace7aa84daabc', 'john', '2012-03-27 13:14:39'),
(10, '馮嘉祥', 'e78fa198b24c6b44ede9d34f3e7009a3', 'john', '2012-03-27 13:01:02'),
(11, '鄒玫璟', 'cf5d498237369416adc2ed0af281ec34', 'john', '2012-03-27 13:01:01'),
(12, '倪韡秦', 'f9706ee2d2d59ef3bd5c81d43d5a125e', 'john', '2012-03-27 13:01:00'),
(13, '李怡瑩', '73c2d18469d406ea57756a8738397063', 'john', '2012-03-27 13:01:00'),
(14, '張哲瑞', '8027c1caf6eb2eebf0e68216524d6d3a', 'maria', '2012-03-27 13:18:03'),
(15, '蘇少瑜', '26e6a1a2cd65f9dce37899303b98ae51', 'maria', '2012-03-27 13:18:04'),
(16, '林佳瑾', 'd3597428fcfc8a2729164f43b6f12dc1', 'maria', '2012-03-27 13:18:04'),
(17, '王思婷', 'eb752a832e179128a0ebeec8711e9e56', 'maria', '2012-03-27 13:18:05'),
(18, '程易裕', '5a223cc3310296470c3ac441533ac441', 'maria', '2012-03-27 13:18:05'),
(19, '鍾子佳', '96b86e2dfc5b9ebd6cb2a6a1ba50c611', 'maria', '2012-03-27 13:18:20');

-- --------------------------------------------------------

--
-- 表的结构 `_mails`
--

CREATE TABLE IF NOT EXISTS `_mails` (
  `no` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `_to` varchar(30) NOT NULL,
  `main` varchar(60) NOT NULL,
  `things` varchar(255) NOT NULL,
  `_ip` varchar(60) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- 表的结构 `_selfmails`
--

CREATE TABLE IF NOT EXISTS `_selfmails` (
  `no` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `_to` varchar(30) NOT NULL,
  `main` varchar(60) NOT NULL,
  `things` varchar(255) NOT NULL,
  `_ip` varchar(60) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- 表的结构 `_talk`
--

CREATE TABLE IF NOT EXISTS `_talk` (
  `no` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(30) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `main` varchar(40) NOT NULL,
  `things` varchar(255) NOT NULL,
  `_check` varchar(5) NOT NULL,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 转存表中的数据 `_talk`
--

INSERT INTO `_talk` (`no`, `id`, `time`, `main`, `things`, `_check`) VALUES
(6, '蘇少瑜', '2012-03-27 13:40:40', '蘇少瑜_的快速留言', '測試2', 'maria'),
(5, '吳家熙', '2012-03-27 13:40:19', '吳家熙_的快速留言', '測試1', 'john'),
(4, '張家維', '2012-03-26 16:00:35', '張家維_的快速留言', '各位同學大家好，此網站的主要用途如下：\r\n　　1.作業上傳\r\n　　2.發問\r\n　　3.好站交流\r\n\r\n網站有BUG請用聯絡管理者或傳訊給我，謝謝！', 'ad');

-- --------------------------------------------------------

--
-- 表的结构 `_webs`
--

CREATE TABLE IF NOT EXISTS `_webs` (
  `no` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `id` varchar(20) NOT NULL,
  `_check` varchar(5) NOT NULL,
  `_explain` varchar(255) NOT NULL,
  `_url` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `_webs`
--

INSERT INTO `_webs` (`no`, `id`, `_check`, `_explain`, `_url`, `date`) VALUES
(1, '張家維', 'ad', '夢工場報名網', 'http://dreamwork.sju.edu.tw/dk_register_01/index.php', '2012-03-26 15:43:47'),
(3, '張家維', 'ad', 'PHP表格教學\r\n(台灣PHP聯盟)', 'http://twpug.net/modules/smartsection/item.php?itemid=55', '2012-03-26 16:53:21');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

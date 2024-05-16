-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ride_share
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ride_id` int NOT NULL,
  `passenger_id` int DEFAULT NULL,
  `text` varchar(500) NOT NULL,
  `resovled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `passenger_complaint_fk` (`passenger_id`),
  KEY `ride_complaint_fk` (`ride_id`),
  CONSTRAINT `passenger_complaint_fk` FOREIGN KEY (`passenger_id`) REFERENCES `passenger_accounts` (`id`),
  CONSTRAINT `ride_complaint_fk` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `passenger_id` int NOT NULL,
  `amount` int NOT NULL,
  `date_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `deposit_passenger_fk` (`passenger_id`),
  CONSTRAINT `deposit_passenger_fk` FOREIGN KEY (`passenger_id`) REFERENCES `passenger_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposits`
--

LOCK TABLES `deposits` WRITE;
/*!40000 ALTER TABLE `deposits` DISABLE KEYS */;
/*!40000 ALTER TABLE `deposits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver_accounts`
--

DROP TABLE IF EXISTS `driver_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_num` varchar(15) NOT NULL,
  `email` varchar(320) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `bank_acc_num` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_driver_phone_num` (`phone_num`),
  UNIQUE KEY `unique_driver_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver_accounts`
--

LOCK TABLES `driver_accounts` WRITE;
/*!40000 ALTER TABLE `driver_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `driver_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `parent_location_id` int DEFAULT NULL,
  `location_lat` varchar(20) NOT NULL,
  `location_lon` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `location_name` (`name`),
  KEY `parent_location_fk` (`parent_location_id`),
  CONSTRAINT `parent_location_fk` FOREIGN KEY (`parent_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (5,'Skopje',NULL,'41.9961','21.4317'),(6,'Kumanovo',NULL,'42.1322','21.7144'),(7,'Bitola',NULL,'41.0319','21.3347'),(8,'Prilep',NULL,'41.3464','21.5542'),(9,'Tetovo',NULL,'42.0103','20.9714'),(10,'Štip',NULL,'41.7358','22.1914'),(11,'Veles',NULL,'41.7153','21.7753'),(12,'Ohrid',NULL,'41.1169','20.8019'),(13,'Strumica',NULL,'41.4375','22.6431'),(14,'Gostivar',NULL,'41.8','20.9167'),(15,'Kočani',NULL,'41.9167','22.4125'),(16,'Dračevo',NULL,'41.9367','21.5217'),(17,'Struga',NULL,'41.1775','20.6789'),(18,'Debar',NULL,'41.525','20.5272'),(19,'Kriva Palanka',NULL,'42.2017','22.3317'),(20,'Negotino',NULL,'41.4839','22.0892'),(21,'Sveti Nikole',NULL,'41.865','21.9425'),(22,'Probištip',NULL,'41.9936','22.1767'),(23,'Delčevo',NULL,'41.9661','22.7747'),(24,'Vinica',NULL,'41.8828','22.5092'),(25,'Aračinovo',NULL,'42.0264','21.5617'),(26,'Kičevo',NULL,'41.5142','20.9631'),(27,'Kavadarci',NULL,'41.4328','22.0117'),(28,'Berovo',NULL,'41.7078','22.8564'),(29,'Kratovo',NULL,'42.0783','22.175'),(30,'Gevgelija',NULL,'41.1392','22.5025'),(31,'Vrapčište',NULL,'41.8337','20.8851'),(32,'Radoviš',NULL,'41.6381','22.4644'),(33,'Kruševo',NULL,'41.37','21.2483'),(34,'Čegrane',NULL,'41.8358','20.9736'),(35,'Makedonski Brod',NULL,'41.5133','21.2153'),(36,'Demir Kapija',NULL,'41.4114','22.2422'),(37,'Kučevište',NULL,'42.1097','21.418'),(38,'Tearce',NULL,'42.0775','21.0519'),(39,'Bogdanci',NULL,'41.2031','22.5728'),(40,'Forino',NULL,'41.8242','20.9625'),(41,'Rašče',NULL,'42.0225','21.2506'),(42,'Rosoman',NULL,'41.5161','21.9497'),(43,'Demir Hisar',NULL,'41.2208','21.2031'),(44,'Vevčani',NULL,'41.2403','20.5931'),(45,'Gradsko',NULL,'41.5775','21.9428'),(46,'Valandovo',NULL,'41.3169','22.5611'),(47,'Krivogaštani',NULL,'41.3358','21.3331'),(48,'Pehčevo',NULL,'41.7592','22.8906'),(49,'Plasnica',NULL,'41.4667','21.1167'),(50,'Zrnovci',NULL,'41.8542','22.4442'),(51,'Novaci',NULL,'41.0419','21.4561'),(52,'Bosilovo',NULL,'41.4406','22.7278'),(53,'Mogila',NULL,'41.1083','21.3786'),(54,'Novo Selo',NULL,'41.4128','22.88'),(55,'Konče',NULL,'41.4958','22.3825'),(56,'Rostuša',NULL,'41.61','20.6'),(57,'Jegunovce',NULL,'42.0731','21.1231'),(58,'Rankovce',NULL,'42.1719','22.1167'),(59,'Sopište',NULL,'41.95','21.4333'),(60,'Obleševo',NULL,'41.8833','22.3339'),(61,'Vasilevo',NULL,'41.4758','22.6417'),(62,'Karbinci',NULL,'41.8167','22.2375'),(63,'Lozovo',NULL,'41.7817','21.9025'),(64,'Staro Nagoričane',NULL,'42.2','21.83'),(65,'Brvenica',NULL,'41.9672','20.9808'),(66,'Centar Župa',NULL,'41.4775','20.5578'),(67,'Dolneni',NULL,'41.4264','21.4536'),(68,'Belčišta',NULL,'41.3028','20.8303'),(69,'Čučer-Sandevo',NULL,'42.0975','21.3877'),(70,'Zelenikovo',NULL,'41.8867','21.5869'),(71,'Petrovec',NULL,'41.9389','21.615'),(72,'Želino',NULL,'41.9794','21.0619'),(73,'Star Dojran',NULL,'41.1865','22.7203'),(74,'Studeničani',NULL,'41.9158','21.5306'),(75,'Bogovinje',NULL,'41.9233','20.9133'),(76,'Ilinden',NULL,'41.9945','21.58'),(77,'Lipkovo',NULL,'42.1553','21.5875'),(78,'Makedonska Kamenica',NULL,'42.0208','22.5876'),(79,'Resen',NULL,'41.0893','21.0109');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passenger_accounts`
--

DROP TABLE IF EXISTS `passenger_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passenger_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_num` varchar(15) NOT NULL,
  `email` varchar(320) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_passenger_phone_num` (`phone_num`),
  UNIQUE KEY `unique_passenger_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passenger_accounts`
--

LOCK TABLES `passenger_accounts` WRITE;
/*!40000 ALTER TABLE `passenger_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `passenger_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `passenger_id` int DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `password_reset_driver_fk` (`driver_id`),
  KEY `password_reset_passenger_fk` (`passenger_id`),
  CONSTRAINT `password_reset_driver_fk` FOREIGN KEY (`driver_id`) REFERENCES `driver_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `password_reset_passenger_fk` FOREIGN KEY (`passenger_id`) REFERENCES `passenger_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ride_id` int NOT NULL,
  `passenger_id` int NOT NULL,
  `num_seats` int NOT NULL,
  `status` enum('P','R','C','I') NOT NULL COMMENT 'P - proposed, R - reserved, C - closed, I - under investigation(complaint sent)',
  `pick_up_lat` varchar(20) NOT NULL,
  `pick_up_lon` varchar(20) NOT NULL,
  `drop_off_lat` varchar(20) NOT NULL,
  `drop_off_lon` varchar(20) NOT NULL,
  `driver_arrived` tinyint(1) NOT NULL DEFAULT '0',
  `driver_lat` varchar(20) DEFAULT NULL,
  `driver_lon` varchar(20) DEFAULT NULL,
  `custom_locations` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `reservation_passenger_fk` (`passenger_id`),
  KEY `reservation_ride_fk` (`ride_id`),
  CONSTRAINT `reservation_passenger_fk` FOREIGN KEY (`passenger_id`) REFERENCES `passenger_accounts` (`id`),
  CONSTRAINT `reservation_ride_fk` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ride_reviews`
--

DROP TABLE IF EXISTS `ride_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ride_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driver_id` int NOT NULL,
  `passenger_id` int NOT NULL,
  `ride_id` int NOT NULL,
  `date_time` datetime NOT NULL,
  `time_correctness_score` int NOT NULL,
  `safety_score` int NOT NULL,
  `comfort_score` int NOT NULL,
  `text` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_reviews_fk` (`driver_id`),
  KEY `ride_reviews_fk` (`ride_id`),
  KEY `passenger_review_fk` (`passenger_id`),
  CONSTRAINT `driver_reviews_fk` FOREIGN KEY (`driver_id`) REFERENCES `driver_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `passenger_review_fk` FOREIGN KEY (`passenger_id`) REFERENCES `passenger_accounts` (`id`),
  CONSTRAINT `ride_reviews_fk` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`),
  CONSTRAINT `scores_check` CHECK (((`time_correctness_score` > 0) and (`time_correctness_score` <= 5) and (`safety_score` > 0) and (`safety_score` <= 5) and (`comfort_score` > 0) and (`comfort_score` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ride_reviews`
--

LOCK TABLES `ride_reviews` WRITE;
/*!40000 ALTER TABLE `ride_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `ride_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rides`
--

DROP TABLE IF EXISTS `rides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driver_id` int NOT NULL,
  `from_loc_id` int NOT NULL,
  `to_loc_id` int NOT NULL,
  `date_time` datetime NOT NULL,
  `ride_duration` time NOT NULL,
  `type` enum('I','C') NOT NULL COMMENT '''I'' only instant, ''C'' also confirmation',
  `flexible_departure` tinyint(1) NOT NULL DEFAULT '0',
  `flexible_arrival` tinyint(1) NOT NULL DEFAULT '0',
  `total_seats` int NOT NULL,
  `free_seats` int NOT NULL DEFAULT (`total_seats`),
  `price` int NOT NULL,
  `driver_arrived` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 didnt, 1 did',
  `driver_lon` varchar(20) DEFAULT NULL,
  `driver_lat` varchar(20) DEFAULT NULL,
  `car_model` varchar(50) DEFAULT NULL,
  `car_color` varchar(50) DEFAULT NULL,
  `additional_info` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ride_driver_fk` (`driver_id`),
  KEY `to_loc_fk` (`to_loc_id`),
  KEY `relation_index` (`from_loc_id`,`to_loc_id`),
  KEY `ride_date_time_index` (`date_time`),
  CONSTRAINT `from_loc_fk` FOREIGN KEY (`from_loc_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ride_driver_fk` FOREIGN KEY (`driver_id`) REFERENCES `driver_accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `to_loc_fk` FOREIGN KEY (`to_loc_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `max_total_seats` CHECK (((`total_seats` <= 15) and (`total_seats` > 0)))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rides`
--

LOCK TABLES `rides` WRITE;
/*!40000 ALTER TABLE `rides` DISABLE KEYS */;
/*!40000 ALTER TABLE `rides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_passenger_id` int NOT NULL,
  `to_driver_id` int NOT NULL,
  `ride_id` int NOT NULL,
  `amount` int NOT NULL,
  `date_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_from_fk` (`from_passenger_id`),
  KEY `transactions_ride_fk` (`ride_id`),
  KEY `transactions_to_fk` (`to_driver_id`),
  CONSTRAINT `transactions_from_fk` FOREIGN KEY (`from_passenger_id`) REFERENCES `passenger_accounts` (`id`),
  CONSTRAINT `transactions_ride_fk` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`),
  CONSTRAINT `transactions_to_fk` FOREIGN KEY (`to_driver_id`) REFERENCES `driver_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driver_id` int NOT NULL,
  `amount` int NOT NULL,
  `status` enum('R','C') NOT NULL DEFAULT 'R' COMMENT 'R - requested, C - completed (when we transfer the money)',
  `date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_fk` (`driver_id`),
  CONSTRAINT `driver_fk` FOREIGN KEY (`driver_id`) REFERENCES `driver_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-16 12:31:57

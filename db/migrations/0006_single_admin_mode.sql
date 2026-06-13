DELETE FROM "users"
WHERE NOT ("role" = 'administrator' AND "status" = 'active');
